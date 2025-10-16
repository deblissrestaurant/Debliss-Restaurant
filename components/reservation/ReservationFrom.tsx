import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { BiCalendar, BiGroup, BiRestaurant, BiTable } from "react-icons/bi";
import { usePopUpStore } from "../../stores/popUpStore";
import { useUserStore } from "../../stores/userStore";
import { useReservationStore } from "../../stores/reservationStore";
import { apiUrl } from "../../config/constants";

interface ReservationData {
  numberOfTables: number;
  chairsPerTable: number;
  reservationDate: string;
  reservationTime: string;
  wholeRestaurant: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
}

interface ValidationState {
  customerName: { isValid: boolean; message: string };
  customerEmail: { isValid: boolean; message: string };
  customerPhone: { isValid: boolean; message: string };
}

const ReservationFrom = () => {
  const [reservationData, setReservationData] = useState<ReservationData>({
    numberOfTables: 1,
    chairsPerTable: 2,
    reservationDate: "",
    reservationTime: "",
    wholeRestaurant: false,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialRequests: "",
  });

  const { addAlert, setAlertAction } = usePopUpStore();
  const user = useUserStore((state) => state.user);
  const { fetchUserReservations } = useReservationStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>({
    customerName: { isValid: true, message: "" },
    customerEmail: { isValid: true, message: "" },
    customerPhone: { isValid: true, message: "" },
  });

  // Validation functions
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!name.trim()) {
      return { isValid: false, message: "Name is required" };
    }
    if (!nameRegex.test(name.trim())) {
      return {
        isValid: false,
        message:
          "Please enter a valid name (letters only, at least 2 characters)",
      };
    }
    return { isValid: true, message: "" };
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return { isValid: false, message: "Email is required" };
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }
    return { isValid: true, message: "" };
  };

  const validatePhone = (phone: string) => {
    // Ghanaian phone number validation: starts with 0, followed by 9 digits, or +233 then 9 digits
    const ghanaPhoneRegex = /^(0\d{9}|(\+233\d{9}))$/;
    if (!phone.trim()) {
      return { isValid: false, message: "Phone number is required" };
    }
    if (!ghanaPhoneRegex.test(phone)) {
      return {
        isValid: false,
        message: "Please enter a valid Ghanaian phone number",
      };
    }
    return { isValid: true, message: "" };
  };

  // Initialize form with user data when user is available
  useEffect(() => {
    if (user) {
      setReservationData((prev) => ({
        ...prev,
        customerName: user.name || "",
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    field: keyof ReservationData,
    value: string | number | boolean
  ) => {
    setReservationData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation for contact fields
    if (field === "customerName" && typeof value === "string") {
      const validation = validateName(value);
      setValidationState((prev) => ({
        ...prev,
        customerName: validation,
      }));
    } else if (field === "customerEmail" && typeof value === "string") {
      const validation = validateEmail(value);
      setValidationState((prev) => ({
        ...prev,
        customerEmail: validation,
      }));
    } else if (field === "customerPhone" && typeof value === "string") {
      const validation = validatePhone(value);
      setValidationState((prev) => ({
        ...prev,
        customerPhone: validation,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic required field validation
    if (
      !reservationData.customerName ||
      !reservationData.customerEmail ||
      !reservationData.customerPhone ||
      !reservationData.reservationDate ||
      !reservationData.reservationTime
    ) {
      addAlert("Please fill in all required fields.");
      setAlertAction(() => {
        setIsSubmitting(false);
      });
      return;
    }

    // Name validation (at least 2 characters, only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(reservationData.customerName.trim())) {
      addAlert(
        "Please enter a valid name (at least 2 characters, letters only)."
      );
      setAlertAction(() => {
        setIsSubmitting(false);
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reservationData.customerEmail)) {
      addAlert("Please enter a valid email address.");
      setAlertAction(() => {
        setIsSubmitting(false);
      });
      return;
    }

    // Phone number validation (Ghanaian format)
    const ghanaPhoneRegex = /^(0\d{9}|(\+233\d{9}))$/;
    if (!ghanaPhoneRegex.test(reservationData.customerPhone)) {
      addAlert("Please enter a valid Ghanaian phone number.");
      setAlertAction(() => {
        setIsSubmitting(false);
      });
      return;
    }

    // Date validation (must be future date)
    const selectedDate = new Date(
      reservationData.reservationDate + "T" + reservationData.reservationTime
    );
    const now = new Date();
    if (selectedDate <= now) {
      addAlert("Please select a future date and time.");
      setAlertAction(() => {
        setIsSubmitting(false);
      });
      return;
    }

    // Advance booking validation (at least 1 hour from now)
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    if (selectedDate < oneHourFromNow) {
      addAlert("Reservations must be made at least 1 hour in advance.");
      setAlertAction(() => {
        setIsSubmitting(false);
      });
      return;
    }

    // Business hours validation (assuming 9 AM to 11 PM)
    const selectedHour = selectedDate.getHours();
    if (selectedHour < 9 || selectedHour > 23) {
      addAlert("Please select a time between 9:00 AM and 11:00 PM.");
      setAlertAction(() => {
        setIsSubmitting(false);
      });
      return;
    }

    try {
      // Prepare reservation data
      const reservationPayload = {
        ...reservationData,
        totalGuests: reservationData.wholeRestaurant
          ? 100
          : reservationData.numberOfTables * reservationData.chairsPerTable,
        userId: user?._id || user?.id || null, // Handle both _id and id formats
      };

      console.log("Creating reservation with payload:", reservationPayload);
      console.log("Current user:", user);

      // Send reservation data to backend
      const response = await fetch(apiUrl("reservation"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationPayload),
      });

      const result = await response.json();
      console.log("Reservation creation result:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit reservation");
      }

      addAlert(
        "Reservation submitted successfully! We'll contact you shortly to confirm."
      );

      // If user is logged in, refresh their reservations to update the header
      if (user?.id || user?._id) {
        const userId = user._id || user.id;
        if (userId) {
          console.log("Refreshing reservations for user:", userId);
          await fetchUserReservations(userId);
          console.log("Reservations refreshed");
        }
      }

      // Reset form
      setReservationData({
        numberOfTables: 1,
        chairsPerTable: 2,
        reservationDate: "",
        reservationTime: "",
        wholeRestaurant: false,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        specialRequests: "",
      });
    } catch (error) {
      console.error("Reservation submission error:", error);
      addAlert(
        error instanceof Error
          ? error.message
          : "Failed to submit reservation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalCapacity = () => {
    if (reservationData.wholeRestaurant) {
      return "Entire Restaurant (up to 100 guests)";
    }
    return `${reservationData.numberOfTables} table${
      reservationData.numberOfTables > 1 ? "s" : ""
    } × ${reservationData.chairsPerTable} chairs = ${
      reservationData.numberOfTables * reservationData.chairsPerTable
    } guests`;
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-[#181b1e] rounded-2xl p-8 border border-gray-700"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Reservation Type Selection */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <BiRestaurant className="text-[#ff2100]" />
            Reservation Type
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInputChange("wholeRestaurant", false)}
              className={`p-6 rounded-xl border-2 transition-all ${
                !reservationData.wholeRestaurant
                  ? "border-[#ff2100] bg-[#ff2100]/10"
                  : "border-gray-600 bg-[#0e1113]"
              }`}
            >
              <BiTable className="text-3xl mx-auto mb-2 text-[#ff2100]" />
              <h3 className="font-semibold text-white">Table Reservation</h3>
              <p className="text-sm text-gray-400 mt-1">
                Reserve specific tables
              </p>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInputChange("wholeRestaurant", true)}
              className={`p-6 rounded-xl border-2 transition-all ${
                reservationData.wholeRestaurant
                  ? "border-[#ff2100] bg-[#ff2100]/10"
                  : "border-gray-600 bg-[#0e1113]"
              }`}
            >
              <BiRestaurant className="text-3xl mx-auto mb-2 text-[#ff2100]" />
              <h3 className="font-semibold text-white">Whole Restaurant</h3>
              <p className="text-sm text-gray-400 mt-1">
                Exclusive dining experience
              </p>
            </motion.button>
          </div>
        </div>

        {/* Table Configuration (only show if not whole restaurant) */}
        {!reservationData.wholeRestaurant && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              <BiTable className="text-[#ff2100]" />
              Table Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Number of Tables */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Number of Tables (Max 4)
                </label>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4].map((num) => (
                    <motion.button
                      key={num}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleInputChange("numberOfTables", num)}
                      className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                        reservationData.numberOfTables === num
                          ? "border-[#ff2100] bg-[#ff2100] text-white"
                          : "border-gray-600 text-gray-300 hover:border-[#ff2100]"
                      }`}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Chairs per Table */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Chairs per Table (Max 6)
                </label>
                <div className="flex items-center space-x-4">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <motion.button
                      key={num}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleInputChange("chairsPerTable", num)}
                      className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                        reservationData.chairsPerTable === num
                          ? "border-[#ff2100] bg-[#ff2100] text-white"
                          : "border-gray-600 text-gray-300 hover:border-[#ff2100]"
                      }`}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Capacity Summary */}
            <div className="bg-[#0e1113] rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-[#ff2100] font-semibold">
                <BiGroup className="text-xl" />
                Total Capacity: {getTotalCapacity()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Date and Time */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <BiCalendar className="text-[#ff2100]" />
            Date & Time
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Reservation Date *
              </label>
              <input
                type="date"
                value={reservationData.reservationDate}
                onChange={(e) =>
                  handleInputChange("reservationDate", e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full py-3 px-4 bg-[#0e1113] border-2 border-gray-600 rounded-lg text-white focus:border-[#ff2100] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Reservation Time *
              </label>
              <select
                value={reservationData.reservationTime}
                onChange={(e) =>
                  handleInputChange("reservationTime", e.target.value)
                }
                className="w-full py-3 px-4 bg-[#0e1113] border-2 border-gray-600 rounded-lg text-white focus:border-[#ff2100] focus:outline-none transition-colors"
                required
              >
                <option value="">Select Time</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="13:30">1:30 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="18:30">6:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="19:30">7:30 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="20:30">8:30 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={reservationData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                placeholder="Enter your full name"
                className={`w-full py-3 px-4 bg-[#0e1113] border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  !validationState.customerName.isValid
                    ? "border-red-500 focus:border-red-400"
                    : validationState.customerName.isValid &&
                      reservationData.customerName
                    ? "border-green-500 focus:border-green-400"
                    : "border-gray-600 focus:border-[#ff2100]"
                }`}
                required
              />
              {!validationState.customerName.isValid && (
                <p className="text-red-400 text-sm mt-1">
                  {validationState.customerName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={reservationData.customerEmail}
                onChange={(e) =>
                  handleInputChange("customerEmail", e.target.value)
                }
                placeholder="Enter your email"
                className={`w-full py-3 px-4 bg-[#0e1113] border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  !validationState.customerEmail.isValid
                    ? "border-red-500 focus:border-red-400"
                    : validationState.customerEmail.isValid &&
                      reservationData.customerEmail
                    ? "border-green-500 focus:border-green-400"
                    : "border-gray-600 focus:border-[#ff2100]"
                }`}
                required
              />
              {!validationState.customerEmail.isValid && (
                <p className="text-red-400 text-sm mt-1">
                  {validationState.customerEmail.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={reservationData.customerPhone}
              onChange={(e) =>
                handleInputChange("customerPhone", e.target.value)
              }
              placeholder="Enter your phone number"
              className={`w-full py-3 px-4 bg-[#0e1113] border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                !validationState.customerPhone.isValid
                  ? "border-red-500 focus:border-red-400"
                  : validationState.customerPhone.isValid &&
                    reservationData.customerPhone
                  ? "border-green-500 focus:border-green-400"
                  : "border-gray-600 focus:border-[#ff2100]"
              }`}
              required
            />
            {!validationState.customerPhone.isValid && (
              <p className="text-red-400 text-sm mt-1">
                {validationState.customerPhone.message}
              </p>
            )}
            <p className="text-gray-400 text-sm mt-1">
              Format: 0xxxxxxxxx (10 digits) or +233xxxxxxxxx (12 digits)
            </p>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Special Requests (Optional)
            </label>
            <textarea
              value={reservationData.specialRequests}
              onChange={(e) =>
                handleInputChange("specialRequests", e.target.value)
              }
              placeholder="Any dietary restrictions, special occasions, or other requests..."
              rows={4}
              className="w-full py-3 px-4 bg-[#0e1113] border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#ff2100] focus:outline-none transition-colors resize-vertical"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="w-full py-4 bg-[#ff2100] text-white font-semibold text-lg rounded-lg hover:bg-[#e01d00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting Reservation..." : "Submit Reservation"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ReservationFrom;
