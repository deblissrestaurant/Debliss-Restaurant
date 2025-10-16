import { useEffect, useState } from "react";
import AdminSideBar from "./AdminSideBar";
import AdminOrderCard from "../components/admin/AdminOrderCard";
import type { Rider } from "../Interfaces/Interfaces";
import { motion } from "motion/react";
import { useAdminStore } from "../stores/adminStore";
import { useAnimationStore } from "../stores/animationStore";
import { apiUrl } from "../config/constants";

export default function AdminOrders() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [view, setView] = useState("current");

  const { fetchOrders } = useAdminStore();

  const animation = useAnimationStore((state) => state.animation);

  // Use separate selectors to avoid creating new objects
  const activeOrders = useAdminStore((state) => state.activeOrders);
  const finishedOrders = useAdminStore((state) => state.finishedOrders);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isActive = true;

    const startPolling = () => {
      interval = setInterval(() => {
        if (isActive) {
          fetchOrders();
        }
      }, 5000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else if (isActive) {
        fetchOrders();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startPolling();

    return () => {
      isActive = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrders();

    fetch(apiUrl("admin/riders"))
      .then((res) => res.json())
      .then((data) => setRiders(Array.isArray(data) ? data : [fetchOrders]))
      .catch((err) => console.error("Error fetching riders:", err));
  }, [fetchOrders]);

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="p-6">
        <h1 className="text-center text-4xl font-bold pb-6">Orders</h1>

        <div className="flex justify-center mb-8">
          <div className="rounded-lg space-x-2 sm:p-2 text-xs sm:text-base flex items-center">
            <motion.button
              initial={{ backgroundColor: "#0e1113 " }}
              animate={{
                backgroundColor: view === "current" ? "#ff1200" : "#0e1113",
              }}
              whileHover={{
                color: view !== "current" ? "#ff1200" : "#ffffff",
              }}
              className="sm:px-6 sm:py-3 px-3 py-2 rounded-lg font-semibold cursor-pointer "
              onClick={() => setView("current")}
            >
              Active Orders
            </motion.button>
            <motion.button
              initial={{ backgroundColor: "#0e1113 " }}
              animate={{
                backgroundColor: view === "finished" ? "#ff1200" : "#0e1113",
              }}
              whileHover={{
                color: view !== "finished" ? "#ff1200" : "#ffffff",
              }}
              className="sm:px-6 sm:py-3 px-3 py-2  rounded-lg font-semibold cursor-pointer "
              onClick={() => setView("finished")}
            >
              Finished Orders
            </motion.button>
          </div>
        </div>

        {animation !== "order error" ? (
          <section>
            {view === "current" ? (
              activeOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">
                    No current orders found.
                  </p>
                </div>
              ) : (
                activeOrders.map((order) => (
                  <AdminOrderCard
                    order={order}
                    riders={riders}
                    showActions={true}
                  />
                ))
              )
            ) : finishedOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No finished orders found.
                </p>
              </div>
            ) : (
              finishedOrders.map((order) => (
                <AdminOrderCard order={order} riders={riders} />
              ))
            )}
          </section>
        ) : (
          <div className="h-[65vh] flex justify-center items-center gap-2">
            <div className="flex justify-center items-center flex-col gap-4">
              <p className="text-3xl text-gray-400">Error loading orders</p>
              <button
                className="bg-[#ff1200] rounded-lg px-4 py-2 cursor-pointer"
                onClick={fetchOrders}
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

