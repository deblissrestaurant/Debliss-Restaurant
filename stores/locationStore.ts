import { create } from "zustand";
import type { location } from "../Interfaces/Interfaces";
import { persist } from "zustand/middleware";
import { useAnimationStore } from "./animationStore";

type address = {
  suburb: string;
  street: string;
};

interface locationStates {
  location: location;
  addresses: address[];
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface locationActions {
  setLocation: (location: location) => void;
  findLocation: () => void;
  geocode: (location: string) => void;
  reverseGeoCode: (lat: number, lon: number) => void;
  autoComplete: (location: string) => void;
}

type locationStore = locationStates & locationActions;

const key = import.meta.env.VITE_LOCATIONIQ_KEY;

function errorCallback(error: GeolocationPositionError) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.error("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.error("The request to get user location timed out.");
      break;
    default:
      console.error("An unknown error occurred.");
      break;
  }
}

export const useLocationStore = create<locationStore>()(
  persist(
    (set, get) => ({
      location: {
        name: "",
        lat: 0,
        lon: 0,
      },

      addresses: [],

      coordinates: { lat: 5.56, lon: -0.205 },

      setLocation: (location: location) => {
        set(() => ({ location: location }));
      },

      reverseGeoCode: async (lat: number, lon: number) => {
        const { setAnimation } = useAnimationStore.getState();

        try {
          const res = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${key}&lat=${lat}&lon=${lon}&format=json&`
          );
          const data = await res.json();

          console.log(data);

          // Filter out undefined address parts and create clean location name
          const addressParts = [data.address.suburb, data.address.road].filter(
            Boolean
          );
          const locationName = addressParts.join(", ");

          set((state) => ({
            location: {
              ...state.location,
              name: locationName,
            },
          }));
          setAnimation("");
        } catch (error) {
          console.error(error);
          setAnimation("");
        }
      },

      findLocation: () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              set((state) => ({
                location: { ...state.location, lat, lon },
                coordinates: { lat, lon },
              }));
              console.log(` lat: ${lat}, lon: ${lon}`);
              get().reverseGeoCode(lat, lon);
            },
            errorCallback
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      },

      autoComplete: async (location: string) => {
        try {
          const res = await fetch(
            `https://api.locationiq.com/v1/autocomplete?key=${key}&q=${location}&limit=5&dedupe=1&countrycodes=gh&`
          );

          const data = await res.json();

          set(() => ({
            addresses: data.map(
              (item: { address: { suburb: string; name: string } }) => ({
                suburb: item.address.suburb,
                street: item.address.name,
              })
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },

      geocode: async (location: string) => {
        try {
          const encodedValue = encodeURIComponent(location);

          const res = await fetch(
            `https://us1.locationiq.com/v1/search?key=${key}&q=${encodedValue}&format=json`
          );

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          console.log(data);

          if (data && data.length > 0) {
            set((state) => ({
              location: {
                ...state.location,
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
              },
            }));
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      },
    }),
    {
      name: "location-storage",
      partialize: (state) => ({ location: state.location }),
    }
  )
);
