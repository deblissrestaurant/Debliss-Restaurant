import { useEffect } from "react";
import { useAdminStore } from "../stores/adminStore";

export const useRefreshMenuEffect = () => {
  const refreshMenu = useAdminStore((state) => state.refreshMenu);

  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]); // Includes dependency as React recommends
};
