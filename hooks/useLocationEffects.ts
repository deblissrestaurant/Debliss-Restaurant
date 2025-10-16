import { useEffect, useRef } from "react";
import { useLocationStore } from "../stores/locationStore";

/**
 * Hook that handles location-related side effects
 */
export const useLocationEffects = () => {
  const location = useLocationStore((state) => state.location);
  const findLocation = useLocationStore((state) => state.findLocation);

  // Use ref to track if we've already tried to find location
  const hasTriedFindLocation = useRef(false);

  // Effect that runs when location changes
  useEffect(() => {
    console.log("Location changed:", location);

    // Add more useful side effects here:
    if (location.lat !== 0 && location.lon !== 0) {
      console.log("Valid location detected:", location.name);

      // You could:
      // - Save to analytics
      // - Update other stores
      // - Trigger delivery calculations
      // - Show location-based notifications
    } else {
      console.log("No valid location set");
    }
  }, [location]);

  // Effect that runs once on mount to initialize location
  useEffect(() => {
    // Auto-find location if not already set and we haven't tried yet
    if (
      location.lat === 0 &&
      location.lon === 0 &&
      !hasTriedFindLocation.current
    ) {
      console.log("No location found, attempting to find location...");
      hasTriedFindLocation.current = true;
      findLocation();
    }
  }, [location.lat, location.lon, findLocation]);
};

/**
 * Simpler hook that just logs location changes
 */
export const useLocationLogger = () => {
  const location = useLocationStore((state) => state.location);

  useEffect(() => {
    console.log("Location:", location);
  }, [location]);
};
