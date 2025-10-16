import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BiCalendar, BiGroup, BiTable, BiX, BiTime } from "react-icons/bi";
import {
  useReservationStore,
  type Reservation,
} from "../stores/reservationStore";
import { useUserStore } from "../stores/userStore";
import { usePopUpStore } from "../stores/popUpStore";
import Header from "../components/general/Header";
import Footer from "../components/general/Footer";

const CurrentReservations = () => {
  const user = useUserStore((state) => state.user);
  const {
    reservations,
    loading,
    error,
    fetchUserReservations,
    cancelReservation,
  } = useReservationStore();
  const { addAlert, setAlertAction } = usePopUpStore();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id || user?._id) {
      const userId = user._id || user.id;
      if (userId) {
        fetchUserReservations(userId);
      }
    }
  }, [user?.id, user?._id, fetchUserReservations]);

  const handleCancelReservation = async (reservation: Reservation) => {
    const reservationDateTime = new Date(
      reservation.reservationDate + "T" + reservation.reservationTime
    );
    const now = new Date();
    const oneHourBefore = new Date(
      reservationDateTime.getTime() - 60 * 60 * 1000
    );

    if (now >= oneHourBefore) {
      addAlert(
        "Cannot cancel reservation less than 1 hour before the scheduled time."
      );
      return;
    }

    setAlertAction(() => {
      confirmCancelReservation(reservation._id);
    });
    addAlert(
      `Are you sure you want to cancel your reservation for ${formatDate(
        reservation.reservationDate
      )} at ${formatTime(reservation.reservationTime)}?`
    );
  };

  const confirmCancelReservation = async (reservationId: string) => {
    setCancellingId(reservationId);
    const success = await cancelReservation(reservationId);

    if (success) {
      addAlert("Reservation cancelled successfully!");
    } else {
      addAlert("Failed to cancel reservation. Please try again.");
    }

    setCancellingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0e1113]">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-[#ff2100] mb-4">
              Please Log In
            </h1>
            <p className="text-gray-300">
              You need to be logged in to view your reservations.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1113]">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-[#ff2100] mb-4">
              MY RESERVATIONS
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              View and manage your upcoming reservations at De Bliss Food Hub.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff2100] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your reservations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => {
                  if (user?.id || user?._id) {
                    const userId = user._id || user.id;
                    if (userId) {
                      fetchUserReservations(userId);
                    }
                  }
                }}
                className="px-6 py-2 bg-[#ff2100] text-white rounded-lg hover:bg-[#d81b00] transition"
              >
                Try Again
              </button>
            </div>
          ) : reservations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BiTable size={64} className="mx-auto text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-400 mb-2">
                No Active Reservations
              </h2>
              <p className="text-gray-500 mb-6">
                You don't have any upcoming reservations.
              </p>
              <motion.a
                href="/reservation"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-[#ff2100] text-white rounded-lg font-semibold hover:bg-[#d81b00] transition"
              >
                Make a Reservation
              </motion.a>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {reservations.map((reservation) => (
                <motion.div
                  key={reservation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#181c1f] border border-gray-600 rounded-xl p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`text-sm font-semibold uppercase tracking-wide ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {reservation.status}
                        </span>
                        {reservation.wholeRestaurant && (
                          <span className="bg-[#ff2100] text-white text-xs px-2 py-1 rounded-full">
                            Whole Restaurant
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 text-gray-300">
                          <BiCalendar className="text-[#ff2100]" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="font-semibold">
                              {formatDate(reservation.reservationDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <BiTime className="text-[#ff2100]" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Time</p>
                            <p className="font-semibold">
                              {formatTime(reservation.reservationTime)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <BiTable className="text-[#ff2100]" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Tables</p>
                            <p className="font-semibold">
                              {reservation.numberOfTables} table(s)
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-300">
                          <BiGroup className="text-[#ff2100]" size={20} />
                          <div>
                            <p className="text-sm text-gray-400">Guests</p>
                            <p className="font-semibold">
                              {reservation.totalGuests} guest(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      {reservation.specialRequests && (
                        <div className="mt-4 p-3 bg-[#0e1113] rounded-lg">
                          <p className="text-sm text-gray-400 mb-1">
                            Special Requests
                          </p>
                          <p className="text-gray-300">
                            {reservation.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="lg:ml-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelReservation(reservation)}
                        disabled={cancellingId === reservation._id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                          cancellingId === reservation._id
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {cancellingId === reservation._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <BiX size={18} />
                            Cancel Reservation
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CurrentReservations;
