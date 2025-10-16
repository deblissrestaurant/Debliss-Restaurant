import { create } from "zustand";
import type { Accompaniment } from "../Interfaces/Interfaces";
import { apiUrl } from "../config/constants";

interface AccompanimentStore {
  accompaniments: Accompaniment[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchAccompaniments: () => Promise<void>;
  createAccompaniment: (
    accompaniment: Omit<Accompaniment, "_id">
  ) => Promise<boolean>;
  updateAccompaniment: (
    id: string,
    updates: Partial<Accompaniment>
  ) => Promise<boolean>;
  deleteAccompaniment: (id: string) => Promise<boolean>;
  getAccompanimentsByCategory: (category: string) => Accompaniment[];
  setError: (error: string | null) => void;
}

export const useAccompanimentStore = create<AccompanimentStore>((set, get) => ({
  accompaniments: [],
  loading: false,
  error: null,

  fetchAccompaniments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(apiUrl("accompaniments"));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const accompaniments = await response.json();
      set({ accompaniments, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch accompaniments";
      set({ error: errorMessage, loading: false });
      console.error("Error fetching accompaniments:", error);
    }
  },

  createAccompaniment: async (accompaniment) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(apiUrl("admin/create-accompaniment"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accompaniment),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Refresh the accompaniments list
        await get().fetchAccompaniments();
        set({ loading: false });
        return true;
      } else {
        throw new Error(result.error || "Failed to create accompaniment");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create accompaniment";
      set({ error: errorMessage, loading: false });
      console.error("Error creating accompaniment:", error);
      return false;
    }
  },

  updateAccompaniment: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(apiUrl("admin/update-accompaniment"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update the local state
        set((state) => ({
          accompaniments: state.accompaniments.map((acc) =>
            acc._id === id ? { ...acc, ...updates } : acc
          ),
          loading: false,
        }));
        return true;
      } else {
        throw new Error(result.error || "Failed to update accompaniment");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update accompaniment";
      set({ error: errorMessage, loading: false });
      console.error("Error updating accompaniment:", error);
      return false;
    }
  },

  deleteAccompaniment: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(apiUrl(`admin/delete-accompaniment/${id}`), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        set((state) => ({
          accompaniments: state.accompaniments.filter((acc) => acc._id !== id),
          loading: false,
        }));
        return true;
      } else {
        throw new Error(result.error || "Failed to delete accompaniment");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete accompaniment";
      set({ error: errorMessage, loading: false });
      console.error("Error deleting accompaniment:", error);
      return false;
    }
  },

  getAccompanimentsByCategory: (category) => {
    return get().accompaniments.filter(
      (acc) => acc.category === category && acc.available !== false
    );
  },

  setError: (error) => set({ error }),
}));
