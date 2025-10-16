import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";

/**
 * Custom hook that handles user-related side effects
 * This replaces the useEffect from your UserContext
 */
export function useUserEffects() {
  const { initializeUser } = useUserStore();

  const user = useUserStore((state) => state.user);

  // Initialize user from localStorage on mount (replaces your useEffect)
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Optional: Log user changes for debugging/analytics
  useEffect(() => {
    if (user) {
      console.log("User logged in:", user.id);
      // You could add analytics tracking here
    } else {
      console.log("User logged out");
    }
  }, [user]);

  return { user };
}

/**
 * Alternative: Hook for automatic user initialization without logging
 * Use this if you just want the initialization without extra effects
 */
export function useUserInitialization() {
  const initializeUser = useUserStore((state) => state.initializeUser);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);
}
