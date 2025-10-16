import { useEffect } from "react";
import { usePopUpStore } from "../stores/popUpStore";

export const usePopUpEffects = () => {
  const popUpCount = usePopUpStore((state) => state.popUpCount);

  useEffect(() => {
    if (popUpCount > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    console.log("PopUp count changed:", popUpCount);

    // Cleanup function to ensure body overflow is reset
    return () => {
      if (popUpCount === 0) {
        document.body.style.overflow = "auto";
      }
    };
  }, [popUpCount]);
};
