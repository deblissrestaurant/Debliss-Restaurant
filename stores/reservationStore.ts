import { create } from "zustand";
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
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ReservationStore {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  fetchUserReservations: (userId: string) => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<boolean>;
  clearReservations: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  loading: false,
  error: null,

  fetchUserReservations: async (userId: string) => {
    console.log("Fetching reservations for user:", userId);
    set({ loading: true, error: null });

    try {
      const response = await fetch(apiUrl(`user/reservations/${userId}`));
      const data = await response.json();
      console.log("Reservation fetch response:", data);

      if (data.success) {
        // Filter out completed and cancelled reservations, show only pending and confirmed
        const activeReservations = data.reservations.filter(
          (reservation: Reservation) =>
            reservation.status === "pending" ||
            reservation.status === "confirmed"
        );
        console.log("Active reservations:", activeReservations);
        set({ reservations: activeReservations, loading: false });
      } else {
        set({
          error: data.error || "Failed to fetch reservations",
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      set({ error: "Failed to fetch reservations", loading: false });
    }
  },

  cancelReservation: async (reservationId: string) => {
    try {
      const response = await fetch(
        apiUrl(`reservation/${reservationId}/cancel`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove the cancelled reservation from the store
        set((state) => ({
          reservations: state.reservations.filter(
            (reservation) => reservation._id !== reservationId
          ),
        }));
        return true;
      } else {
        set({ error: data.error || "Failed to cancel reservation" });
        return false;
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      set({ error: "Failed to cancel reservation" });
      return false;
    }
  },

  clearReservations: () => {
    set({ reservations: [], error: null });
  },
}));

export type { Reservation };
