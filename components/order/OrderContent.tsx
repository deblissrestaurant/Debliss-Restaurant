import { useCallback, useState } from "react";
import { useEffect } from "react";
import OrderCard from "./OrderCard";
import { motion } from "motion/react";
import type { Order } from "../../Interfaces/Interfaces";
import { useUserStore } from "../../stores/userStore";
import { apiUrl } from "../../config/constants";

const OrderContent = () => {
  const user = useUserStore((state) => state.user);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [finishedOrders, setFinishedOrders] = useState<Order[]>([]);
  const [view, setView] = useState("active");
  const [status, setStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    console.log("Fetching orders for user:", user);
    console.log("User name:", user?.name);
    console.log("User _id:", user?._id);
    console.log("User id:", user?.id);

    setStatus("loading");

    if (user && (user._id || user.id)) {
      const userId = user._id || user.id;
      try {
        const activeRes = await fetch(apiUrl(`user-orders/${userId}`));
        if (!activeRes.ok)
          throw new Error(`HTTP error! status: ${activeRes.status}`);
        const activeData = await activeRes.json();
        setActiveOrders(Array.isArray(activeData) ? activeData : []);
        setStatus("");
      } catch (err) {
        console.error("Failed to fetch active orders", err);
        setActiveOrders([]);
        setStatus("error");
      }

      try {
        const finishedRes = await fetch(apiUrl(`user-finished-orders/${userId}`));
        if (!finishedRes.ok)
          throw new Error(`HTTP error! status: ${finishedRes.status}`);
        const finishedData = await finishedRes.json();
        setFinishedOrders(Array.isArray(finishedData) ? finishedData : []);
        setStatus("");
      } catch (error) {
        console.error(error);

        setFinishedOrders([]);
        setStatus("error");
      }
    } else {
      console.log("No user or user ID found:", user);
      console.log("LocalStorage user:", localStorage.getItem("user"));
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();

    // Set up polling for real-time updates
    const pollInterval = setInterval(fetchOrders, 15000); // Poll every 15 seconds

    return () => clearInterval(pollInterval);
  }, [fetchOrders]);

  useEffect(() => {
    console.log(activeOrders);
  }, [activeOrders]);

  const handleOrderUpdate = (updatedOrder: Order) => {
    setActiveOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  const handleFinishedOrderUpdate = (updatedOrder: Order) => {
    setFinishedOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  return (
    <div className="mt-20 px-4">
      <div className="border-b border-b-[#ff1200] pb-2 mb-8 flex justify-between items-center">
        <h1 className="sm:text-4xl text-2xl font-bold">Orders</h1>
        <div className="rounded-lg space-x-2 sm:p-2 text-xs sm:text-base flex items-center">
          <motion.button
            initial={{ backgroundColor: "#0e1113 " }}
            animate={{
              backgroundColor: view === "active" ? "#ff1200" : "#0e1113",
            }}
            whileHover={{
              color: view !== "active" ? "#ff1200" : "#ffffff",
            }}
            className="sm:px-6 sm:py-3 px-3 py-2 rounded-lg font-semibold cursor-pointer "
            onClick={() => setView("active")}
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
      {status === "" ? (
        <div>
          {view === "active" ? (
            <div>
              {activeOrders.length > 0 ? (
                activeOrders.map((item) => (
                  <OrderCard
                    key={item._id}
                    order={item}
                    onOrderUpdate={handleOrderUpdate}
                  />
                ))
              ) : (
                <div className="h-120 flex justify-center items-center">
                  <p className="text-xl font-bold text-gray-400">
                    No active orders
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {finishedOrders.length > 0 ? (
                finishedOrders.map((item) => (
                  <OrderCard
                    key={item._id}
                    order={item}
                    isActive={false}
                    onOrderUpdate={handleFinishedOrderUpdate}
                  />
                ))
              ) : (
                <div className="h-120 flex justify-center items-center">
                  <p className="text-xl font-bold text-gray-400">
                    No completed orders
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="h-[65vh] flex justify-center items-center gap-2">
          {status === "loading" && (
            <div className="flex items-center flex-col justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  ease: "linear",
                  repeat: Infinity,
                  duration: 1,
                }}
                className="size-10 flex justify-center items-center border-[#ff1200] border-r-transparent rounded-full border-2"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    ease: "linear",
                    repeat: Infinity,
                    duration: 0.7,
                  }}
                  className="size-8 border-[#ff1200] border-r-transparent rounded-full border-2"
                />
              </motion.div>
              <p className="text-xl text-gray-300">Loading orders...</p>
            </div>
          )}
          {status === "error" && (
            <div className="flex justify-center items-center flex-col gap-4">
              <p className="text-3xl text-gray-400">Error loading orders</p>
              <button
                className="bg-[#ff1200] rounded-lg px-4 py-2 cursor-pointer"
                onClick={fetchOrders}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderContent;
