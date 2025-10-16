import { BsWhatsapp } from "react-icons/bs";
import type { Order } from "../../Interfaces/Interfaces";
import { BiCheck, BiPhone } from "react-icons/bi";
import { motion } from "motion/react";
import { useState, useEffect, useCallback } from "react";
import { usePopUpStore } from "../../stores/popUpStore";
import { apiUrl } from "../../config/constants";

const OrderCard = ({
  order,
  isActive = true,
  onOrderUpdate,
}: {
  order: Order;
  isActive?: boolean;
  onOrderUpdate?: (updatedOrder: Order) => void;
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [time, setTime] = useState(0);
  const { addAlert, setAlertAction, confirm } = usePopUpStore();

  const key = import.meta.env.VITE_LOCATIONIQ_KEY;
  const RESTAURANT_LON = -0.16507375965959975;
  const RESTAURANT_LAT = 5.677069742918279;

  // Get stored delivery time from localStorage
  const getStoredDeliveryTime = useCallback(
    (orderId: string): number | null => {
      try {
        const stored = localStorage.getItem(`deliveryTime_${orderId}`);
        if (!stored) return null;

        try {
          // Try to parse as new format with timestamp
          const data = JSON.parse(stored);
          if (typeof data === "object" && data.time !== undefined) {
            return data.time;
          }
          // Fallback for old format (just number)
          return typeof data === "number" ? data : null;
        } catch {
          // If parsing fails, try as old format (plain number string)
          const numValue = parseInt(stored, 10);
          return isNaN(numValue) ? null : numValue;
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
      }
    },
    []
  );

  // Store delivery time in localStorage with timestamp
  const storeDeliveryTime = useCallback(
    (orderId: string, deliveryTime: number) => {
      try {
        const data = {
          time: deliveryTime,
          timestamp: Date.now(),
        };
        localStorage.setItem(`deliveryTime_${orderId}`, JSON.stringify(data));
      } catch (error) {
        console.error("Error storing to localStorage:", error);
      }
    },
    []
  );

  // Clean up old delivery times (older than 24 hours)
  const cleanupOldDeliveryTimes = useCallback(() => {
    try {
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("deliveryTime_")) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const data = JSON.parse(stored);
              if (now - data.timestamp > oneDayMs) {
                localStorage.removeItem(key);
                console.log(`Cleaned up old delivery time: ${key}`);
              }
            } catch {
              // If data is in old format (just number), remove it
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error cleaning up localStorage:", error);
    }
  }, []);

  const getTime = useCallback(async () => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/matrix/driving/${RESTAURANT_LON},${RESTAURANT_LAT};${order.location.lon},${order.location.lat}?key=${key}`
      );

      const data = await response.json();

      let calculatedTime;
      if (data.durations[0][1] > data.durations[1][0]) {
        calculatedTime = Math.ceil(data.durations[0][1] / 60);
      } else {
        calculatedTime = Math.ceil(data.durations[1][0] / 60);
      }

      setTime(calculatedTime);
      // Store the calculated time in localStorage
      storeDeliveryTime(order._id, calculatedTime);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }, [
    key,
    order.location?.lat,
    order.location?.lon,
    order._id,
    RESTAURANT_LAT,
    RESTAURANT_LON,
    storeDeliveryTime,
  ]);

  useEffect(() => {
    console.log(time);
  }, [time]);

  // Cleanup old delivery times on component mount
  useEffect(() => {
    cleanupOldDeliveryTimes();
  }, [cleanupOldDeliveryTimes]);

  // Poll for order updates every 10 seconds
  useEffect(() => {
    if (!isActive) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(apiUrl(`user/order/${order._id}`));
        if (response.ok) {
          const updatedOrder = await response.json();
          setCurrentOrder(updatedOrder);
          onOrderUpdate?.(updatedOrder);
        }
      } catch (error) {
        console.error("Failed to fetch order updates:", error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [order._id, isActive, onOrderUpdate]);

  // Update local state when prop changes
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  // Load delivery time from localStorage or calculate it
  useEffect(() => {
    if (order.location?.lat && order.location?.lon) {
      // First, check if we have a stored delivery time
      const storedTime = getStoredDeliveryTime(order._id);

      if (storedTime !== null) {
        // Use stored time if available
        setTime(storedTime);
        console.log(
          `Using stored delivery time for order ${order._id}: ${storedTime} mins`
        );
      } else if (time === 0) {
        // Only make API call if no stored time and current time is 0
        console.log(
          `No stored time found for order ${order._id}, calculating...`
        );
        getTime();
      }
    }
  }, [order.location, order._id, time, getTime, getStoredDeliveryTime]);

  useEffect(() => {
    console.log("kutfut", currentOrder[key]);
  }, [currentOrder, key]);

  const steps = [
    { key: "confirmed", label: "Order Confirmed" },
    { key: "preparing", label: "Preparing" },
    { key: "packing", label: "Packing" },
    {
      key: "outForDelivery",
      label:
        currentOrder.deliveryMethod === "delivery"
          ? "Out for Delivery"
          : "Order Prepared",
    },
  ];

  const handleConfirmReceived = async (orderId: string) => {
    try {
      const res = await fetch(apiUrl("user/mark-finished"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", errorText);
        addAlert("Failed to confirm receipt.");
      }
    } catch (error) {
      console.error("Confirm error:", error);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    // Show confirmation dialog

    addAlert(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    confirm();

    setAlertAction(async () => {
      try {
        const res = await fetch(apiUrl(`user/cancel-order/${orderId}`), {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          addAlert("Order cancelled successfully.");
          // Notify parent component to refresh the orders list
          if (onOrderUpdate) {
            onOrderUpdate({ ...currentOrder, cancelled: true });
          }
          // Optionally, you could also reload the page or remove the order from view
          window.location.reload();
        } else {
          const errorText = await res.text();
          console.error("Server response:", errorText);
          addAlert("Failed to cancel order. Please try again.");
        }
      } catch (error) {
        console.error("Cancel order error:", error);
        addAlert(
          "Failed to cancel order. Please check your connection and try again."
        );
      }
    });
  };

  return (
    <div
      key={currentOrder._id}
      className="rounded-lg border border-gray-600 p-4 sm:p-6 mb-4 sm:mb-6 text-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ff1200]">
            Order Details
          </h3>

          <div className="space-y-2 sm:space-y-3">
            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Contact:
              </span>
              <p className="text-gray-100 text-sm sm:text-base break-words">
                {currentOrder.contact}
              </p>
            </div>

            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Address:
              </span>
              <p className="text-gray-100 text-sm sm:text-base break-words">
                {currentOrder.location?.name ||
                  (currentOrder as Order & { address?: string }).address ||
                  "Address not available"}
              </p>
            </div>
            {currentOrder.deliveryMethod === "pickup" && (
              <div>
                <span className="font-semibold text-gray-300 text-sm sm:text-base">
                  Order Type:
                </span>
                <p className="text-gray-100 text-sm sm:text-base break-words">
                  Pick Up{" "}
                </p>
                {currentOrder.schedule?.isScheduled && (
                  <div className="mt-2">
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">
                      Scheduled For:
                    </span>
                    <p className="text-gray-100 text-sm sm:text-base">
                      {currentOrder.schedule.scheduledFor}
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentOrder.deliveryMethod &&
              currentOrder.deliveryMethod === "delivery" && (
                <div>
                  <div>
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">
                      Assigned Rider:
                    </span>
                    <p className="text-gray-100 text-sm sm:text-base">
                      {currentOrder.riderId && currentOrder.riderId.name
                        ? currentOrder.riderId.name
                        : "Not Assigned"}
                    </p>
                  </div>

                  <div className="">
                    <span className="font-semibold text-gray-300 text-sm sm:text-base">
                      {currentOrder.schedule?.isScheduled
                        ? "Scheduled For:"
                        : "Estimated Delivery Time:"}
                    </span>
                    <p className="text-gray-100 text-sm sm:text-base">
                      {currentOrder.schedule?.isScheduled
                        ? currentOrder.schedule.scheduledFor
                        : time > 0
                        ? `${time + 15} mins`
                        : "Calculating..."}
                    </p>
                  </div>
                </div>
              )}

            {currentOrder.riderId && currentOrder.riderId.phone && (
              <div>
                <span className="font-semibold text-gray-300 text-sm sm:text-base">
                  Rider Contact:
                </span>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                  <a
                    href={`tel:${currentOrder.riderId.phone}`}
                    className="bg-[#ff1200] flex justify-center items-center gap-2 px-3 py-2 rounded hover:bg-[#d81b00] transition text-white text-center text-sm sm:text-base"
                  >
                    <BiPhone /> Call
                  </a>
                  <a
                    href={`https://wa.me/${currentOrder.riderId.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 flex justify-center items-center gap-2 px-3 py-2 rounded hover:bg-green-700 transition text-white text-center text-sm sm:text-base"
                  >
                    <BsWhatsapp /> WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-[#ff1200]">
            Order Items:
          </h4>
          <div className="bg-[#181c1f] rounded-lg p-3 sm:p-4 border border-gray-600">
            <ul className="space-y-2">
              {currentOrder.items.map((item) => (
                <li
                  key={item.menuItem?._id || item._id}
                  className="flex justify-between items-start border-b border-gray-600 pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="flex-1">
                    <p>
                      <span className="text-gray-100 text-sm sm:text-base leading-tight">
                        {item.menuItem && item.menuItem.name
                          ? item.menuItem.name
                          : "Unknown Item"}
                      </span>
                      {item.accompaniments &&
                        item.accompaniments.length > 0 && (
                          <span>
                            {" "}
                            with{" "}
                            {item.accompaniments.map((accompaniment) => (
                              <span key={accompaniment._id}>
                                {accompaniment.name}
                                {accompaniment !==
                                  item.accompaniments?.[
                                    item.accompaniments.length - 1
                                  ] &&
                                  item.accompaniments &&
                                  item.accompaniments.length > 1 &&
                                  ", "}
                              </span>
                            ))}
                          </span>
                        )}
                    </p>
                    {item.specialNote && (
                      <p className="text-yellow-400 text-xs sm:text-sm italic mt-1">
                        Note: {item.specialNote}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-[#ff1200] text-sm sm:text-base whitespace-nowrap ml-2">
                    × {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-base sm:text-lg mt-4 mb-3 sm:mt-0 sm:mb-3 text-[#ff1200]">
          Order Progress
        </h4>
        <div className="space-y-2">
          {!currentOrder.confirmed && (
            <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-3 mb-4">
              <p className="text-yellow-200 text-sm sm:text-base text-center">
                We would contact you to confirm your order
              </p>
            </div>
          )}
          <div className="flex-col flex md:flex-row mb-4 sm:px-9">
            {steps.map(({ key, label }, i) => (
              <div
                key={key}
                className="flex items-center w-fit md:flex-row flex-col"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    initial={{
                      borderColor: "#6c6c6c",
                      backgroundColor: "#0e1113",
                    }}
                    animate={{
                      borderColor: (() => {
                        if (currentOrder[key]) return "#00ff3c";

                        const completedSteps = steps
                          .slice(0, i)
                          .every((step) => currentOrder[step.key]);
                        const isCurrentStep =
                          completedSteps && !currentOrder[key];

                        return isCurrentStep ? "#00ff3c" : "#6c6c6c";
                      })(),
                      backgroundColor: currentOrder[key]
                        ? "#00ff3c"
                        : "#0e1113",
                    }}
                    className="border-gray-300 border rounded-full p-0.5"
                  >
                    <motion.span
                      initial={{ color: "#0e1113" }}
                      animate={{
                        color: currentOrder[key] ? "#000000" : "#0e1113",
                      }}
                    >
                      <BiCheck />
                    </motion.span>
                  </motion.div>

                  <motion.span
                    initial={{ color: "#ffffff" }}
                    animate={{
                      color: currentOrder[key] ? "#00ff3c" : "#ffffff",
                    }}
                    className="absolute md:top-[100%] left-[100%] text-xs md:ml-0 md:mt-1 text-nowrap ml-3 md:left-auto"
                  >
                    {label}
                  </motion.span>
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ backgroundColor: "#6c6c6c" }}
                    animate={{
                      backgroundColor: currentOrder[key]
                        ? "#00ff3c"
                        : "#6c6c6c",
                    }}
                    className="bg-gray-400 md:w-30 w-px h-10 md:h-px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isActive && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-4">
          {currentOrder.outForDelivery && (
            <button
              onClick={() => handleConfirmReceived(currentOrder._id)}
              className="cursor-pointer px-4 bg-[#ff1200] py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#d81b00] transition text-white text-sm sm:text-base"
            >
              Confirm Order Received
            </button>
          )}
          {!currentOrder.confirmed && (
            <button
              onClick={() => handleCancelOrder(currentOrder._id)}
              className="cursor-pointer px-4 border border-red-500 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-500 transition text-white text-sm sm:text-base bg-transparent"
            >
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
