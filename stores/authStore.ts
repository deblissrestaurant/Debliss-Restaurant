import { create } from "zustand";

interface AuthState {
  authType: string; // "login", "register", etc.
}

interface AuthActions {
  setAuth: (type: string) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  // State
  authType: "",

  // Actions
  setAuth: (type: string) => {
    set(() => ({ authType: type }));
  },

  clearAuth: () => {
    set(() => ({ authType: "" }));
  },
}));
