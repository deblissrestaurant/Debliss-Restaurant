import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  BiCalendar,
  BiGroup,
  BiTable,
  BiRestaurant,
  BiPhone,
  BiEnvelope,
  BiTime,
  BiCheck,
  BiX,
  BiRefresh,
} from "react-icons/bi";
import AdminSideBar from "./AdminSideBar";
import { usePopUpStore } from "../stores/popUpStore";
import { apiUrl } from "../config/constants";

interface Reservation {
  _id: string;
  numberOfTables: number;
  chairsPerTable: number;
  reservationDate: string;
  reservationTime: string;
  wholeRestaurant: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalGuests: number;
  createdAt: string;
  updatedAt: string;
}

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [refresh, setRefresh] = useState(false);

  const { addAlert } = usePopUpStore();

  const [view, setView] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      const response = await fetch(apiUrl("admin/reservations"));
      const data = await response.json();

      setReservations(data.reservations);
      setStatus("");
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (
    reservationId: string,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed"
  ) => {
    setUpdatingStatus(reservationId);
    try {
      const response = await fetch(
        apiUrl("admin/reservation-status"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId,
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation._id === reservationId
              ? { ...reservation, status: newStatus }
              : reservation
          )
        );
      } else {
        addAlert("Failed to update reservation status: " + data.error);
      }
    } catch (error) {
      console.error("Error updating reservation status:", error);
      addAlert("Failed to update reservation status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchReservations();

    // Set up polling for real-time updates
    const interval = setInterval(fetchReservations, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredReservations = reservations.filter((reservation) => {
    if (view === "all") return true;
    return reservation.status === view;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
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
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="ml-65">
        <AdminSideBar />
        <div className="flex items-center flex-col justify-center h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              ease: "linear",
              repeat: Infinity,
              duration: 1,
            }}
            className="size-10 flex justify-center items-center border-[#ff1200] border-r-transparent rounded-full border-2"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                ease: "linear",
                repeat: Infinity,
                duration: 0.7,
              }}
              className="size-8 border-[#ff1200] border-r-transparent rounded-full border-2"
            />
          </motion.div>
          <p className="text-xl text-gray-300">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-center text-4xl font-bold">Reservations</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setRefresh(true);
              fetchReservations().then(() => setRefresh(false));
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff2100] text-white rounded-lg hover:bg-[#e01d00] transition-colors"
          >
            <motion.div
              animate={{ rotate: refresh ? 360 : 0 }}
              transition={{
                repeat: refresh ? Infinity : 0,
                duration: 1,
              }}
            >
              <BiRefresh className="text-lg" />
            </motion.div>
            Refresh
          </motion.button>
        </div>
        {status === "error" ? (
          <div className="h-[65vh] flex justify-center items-center gap-2">
            <div className="flex justify-center items-center flex-col gap-4">
              <p className="text-3xl text-gray-400">Error loading orders</p>
              <button
                className="bg-[#ff1200] rounded-lg px-4 py-2 cursor-pointer"
                onClick={() => {
                  fetchReservations();
                  setLoading(true);
                }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="rounded-lg space-x-2 sm:p-2 text-xs sm:text-base flex items-center">
                {["all", "pending", "confirmed", "cancelled"].map(
                  (filterView) => (
                    <motion.button
                      key={filterView}
                      initial={{ backgroundColor: "#0e1113" }}
                      animate={{
                        backgroundColor:
                          view === filterView ? "#ff1200" : "#0e1113",
                      }}
                      whileHover={{
                        color: view !== filterView ? "#ff1200" : "#ffffff",
                      }}
                      className="sm:px-6 sm:py-3 px-3 py-2 rounded-lg font-semibold cursor-pointer capitalize"
                      onClick={() =>
                        setView(
                          filterView as
                            | "all"
                            | "pending"
                            | "confirmed"
                            | "cancelled"
                        )
                      }
                    >
                      {filterView} (
                      {
                        reservations.filter(
                          (r) => filterView === "all" || r.status === filterView
                        ).length
                      }
                      )
                    </motion.button>
                  )
                )}
              </div>
            </div>

            {/* Reservations Grid */}
            <section>
              {filteredReservations.length === 0 ? (
                <div className="text-center py-12">
                  <BiCalendar className="text-6xl text-gray-500 mx-auto mb-4" />
                  <p className="text-xl text-gray-600">
                    No {view === "all" ? "" : view} reservations found.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredReservations.map((reservation) => (
                    <motion.div
                      key={reservation._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#181b1e] rounded-xl p-6 border border-gray-700 hover:border-[#ff2100] transition-colors"
                    >
                      {/* Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {reservation.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {reservation.customerName}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <BiEnvelope className="text-[#ff2100]" />
                            {reservation.customerEmail}
                          </div>
                          <div className="flex items-center gap-2">
                            <BiPhone className="text-[#ff2100]" />
                            {reservation.customerPhone}
                          </div>
                        </div>
                      </div>

                      {/* Reservation Details */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <BiCalendar className="text-[#ff2100]" />
                          {formatDate(reservation.reservationDate)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <BiTime className="text-[#ff2100]" />
                          {formatTime(reservation.reservationTime)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          {reservation.wholeRestaurant ? (
                            <>
                              <BiRestaurant className="text-[#ff2100]" />
                              Whole Restaurant (up to 100 guests)
                            </>
                          ) : (
                            <>
                              <BiTable className="text-[#ff2100]" />
                              {reservation.numberOfTables} table
                              {reservation.numberOfTables > 1 ? "s" : ""} ×{" "}
                              {reservation.chairsPerTable} chairs
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <BiGroup className="text-[#ff2100]" />
                          {reservation.totalGuests} guests
                        </div>
                      </div>

                      {/* Special Requests */}
                      {reservation.specialRequests && (
                        <div className="mb-4 p-3 bg-[#0e1113] rounded-lg border border-gray-700">
                          <p className="text-xs text-gray-400 mb-1">
                            Special Requests:
                          </p>
                          <p className="text-sm text-gray-300">
                            {reservation.specialRequests}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {reservation.status === "pending" && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              updateReservationStatus(
                                reservation._id,
                                "confirmed"
                              )
                            }
                            disabled={updatingStatus === reservation._id}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <BiCheck className="text-lg" />
                            Confirm
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              updateReservationStatus(
                                reservation._id,
                                "cancelled"
                              )
                            }
                            disabled={updatingStatus === reservation._id}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            <BiX className="text-lg" />
                            Cancel
                          </motion.button>
                        </div>
                      )}

                      {reservation.status === "confirmed" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            updateReservationStatus(
                              reservation._id,
                              "completed"
                            )
                          }
                          disabled={updatingStatus === reservation._id}
                          className="w-full flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <BiCheck className="text-lg" />
                          Mark Completed
                        </motion.button>
                      )}

                      {updatingStatus === reservation._id && (
                        <div className="flex items-center justify-center mt-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff2100]"></div>
                          <span className="ml-2 text-xs text-gray-400">
                            Updating...
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Summary Stats */}
            {reservations.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#181b1e] p-4 rounded-lg border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-[#ff2100]">
                    {reservations.length}
                  </div>
                  <div className="text-sm text-gray-400">
                    Total Reservations
                  </div>
                </div>
                <div className="bg-[#181b1e] p-4 rounded-lg border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-yellow-500">
                    {reservations.filter((r) => r.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-400">Pending</div>
                </div>
                <div className="bg-[#181b1e] p-4 rounded-lg border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {
                      reservations.filter((r) => r.status === "confirmed")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-400">Confirmed</div>
                </div>
                <div className="bg-[#181b1e] p-4 rounded-lg border border-gray-700 text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {
                      reservations.filter((r) => r.status === "completed")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
