import { create } from "zustand";

interface ScheduleState {
  scheduledTime: string | null;
  scheduledDate: Date | null;
  setScheduledTime: (time: string | null, date: Date | null) => void;
  clearSchedule: () => void;
  getScheduleString: () => string | null;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  scheduledTime: null,
  scheduledDate: null,

  setScheduledTime: (time: string | null, date: Date | null) => {
    set({ scheduledTime: time, scheduledDate: date });
  },

  clearSchedule: () => {
    set({ scheduledTime: null, scheduledDate: null });
  },

  getScheduleString: () => {
    const state = get();
    if (!state.scheduledTime || !state.scheduledDate) return null;

    const dateStr = state.scheduledDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    return `${dateStr} at ${state.scheduledTime}`;
  },
}));
