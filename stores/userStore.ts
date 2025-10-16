import { create } from "zustand";
import type { User } from "../Interfaces/Interfaces";
import { persist } from "zustand/middleware";

interface userState {
  user: User | null;
  token: string | null;
}

interface userActions {
  setUser: (user: User | null) => void;
  getUser: () => void;
  initializeUser: () => void;
  clearUser: () => void;
  setToken: (token: string | null) => void;
  getToken: () => string | null;
}

type userStore = userState & userActions;

export const useUserStore = create<userStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: (userData: (User & { token?: string }) | null) => {
        if (userData) {
          const userToStore = {
            ...userData,
            id: userData._id || userData.id,
          };

          // Store both user and token in Zustand state
          set(() => ({
            user: userToStore,
            token: userData.token || null,
          }));
        } else {
          get().clearUser();
        }
      },

      getUser: () => {
        return get().user;
      },

      setToken: (token: string | null) => {
        set(() => ({ token }));
      },

      getToken: () => {
        return get().token;
      },

      clearUser: () => {
        set(() => ({ user: null, token: null })); // Clear both user and token
      },

      initializeUser: () => {
        // Zustand persist automatically loads both user and token
        // This method now only handles legacy data migration

        // Check for old localStorage token format and migrate
        const oldToken = localStorage.getItem("token");
        if (oldToken && !get().token) {
          set(() => ({ token: oldToken }));
          localStorage.removeItem("token"); // Remove old format
        }

        // Check for old localStorage user format and migrate
        const oldStoredUser = localStorage.getItem("user");
        if (oldStoredUser && !get().user) {
          try {
            const parsedUser = JSON.parse(oldStoredUser);
            if (parsedUser._id && !parsedUser.id) {
              parsedUser.id = parsedUser._id;
            }
            set(() => ({ user: parsedUser }));
            localStorage.removeItem("user"); // Remove old format
          } catch (error) {
            console.error("Error migrating old user data:", error);
            localStorage.removeItem("user");
          }
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({ user: state.user, token: state.token }),
      // Optional: Add version for future migrations
      version: 1,
    }
  )
);
