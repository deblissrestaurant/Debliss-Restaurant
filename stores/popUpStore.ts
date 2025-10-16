import { create } from "zustand";

interface PopUpState {
  popUpCount: number;
  alert: boolean;
  alertText: string;
  confirmation: boolean;
}

interface PopUpActions {
  addPopUp: () => void;
  removePopUp: () => void;
  addAlert: (alert: string) => void;
  removeAlert: (confirm?: boolean) => void;
  alertAction: () => void;
  setAlertAction: (action: () => void) => void;
  confirm: () => void;
}

type PopUpStore = PopUpState & PopUpActions;

export const usePopUpStore = create<PopUpStore>()((set, get) => ({
  // State
  popUpCount: 0,

  alertText: "",

  alert: false,

  confirmation: false,

  // Actions
  addPopUp: () => {
    set((state) => ({ popUpCount: state.popUpCount + 1 }));
  },

  removePopUp: () => {
    set((state) => ({
      popUpCount: Math.max(0, state.popUpCount - 1), // Prevent negative values
    }));
  },

  addAlert: (alert: string) => {
    set(() => ({ alertText: alert }));

    set(() => ({ alert: true }));
  },

  alertAction: () => {
    // Empty function - can be overridden if needed
  },

  setAlertAction: (action: () => void) => {
    set(() => ({ alertAction: action }));
  },

  confirm: () => {
    set((state)=>({confirmation: !state.confirmation}))
  },

  removeAlert: (confirm = true) => {
    confirm && get().alertAction();
    set(() => ({ alert: false }));
    set(() => ({ alertAction: () => {} }));
    get().removePopUp();
  },
}));
