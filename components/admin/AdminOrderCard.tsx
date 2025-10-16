import { motion } from "motion/react";
import type { Order, Rider } from "../../Interfaces/Interfaces";
import { BiCheck, BiPhone } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import { useAdminStore } from "../../stores/adminStore";
import { usePopUpStore } from "../../stores/popUpStore";
import { apiUrl } from "../../config/constants";

const AdminOrderCard = ({
  order,
  showActions = false,
  riders,
}: {
  order: Order;
  showActions?: boolean;
  riders: Rider[];
}) => {
  const { setFinishedOrders, finishedOrders, fetchOrders } = useAdminStore();
  const { addAlert } = usePopUpStore();

  const handleDeleteFinishedOrder = async (orderId: string) => {
    const confirmDelete = window.confirm(
      "Delete this finished order permanently?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(apiUrl(`admin/finished-orders/${orderId}`), {
        method: "DELETE",
      });
      if (res.ok) {
        setFinishedOrders(finishedOrders.filter((o) => o._id !== orderId));
      } else {
        addAlert("Failed to delete order.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleAssignRider = async (orderId: string, riderId: string) => {
    try {
      // If a rider is being assigned, automatically confirm all previous steps
      if (riderId) {
        const stepsToConfirm = [
          { key: "confirmed", message: "Order Confirmed" },
          { key: "preparing", message: "Preparing Your Order" },
          { key: "packing", message: "Packing Your Order" },
          { key: "outForDelivery", message: "Your order is out for delivery" },
        ];

        // Confirm each step that isn't already confirmed
        for (const step of stepsToConfirm) {
          if (!order[step.key]) {
            const res = await fetch(apiUrl("admin/order-status"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                statusKey: step.key,
                value: step.message,
              }),
            });

            if (!res.ok) {
              throw new Error(`Failed to confirm ${step.key}`);
            }
          }
        }
      }

      // Assign the rider
      const res = await fetch(apiUrl("admin/assign-rider"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, riderId }),
      });

      if (res.ok) {
        fetchOrders();
      } else {
        addAlert("Failed to assign rider");
      }
    } catch (error) {
      console.error("Error in rider assignment:", error);
      addAlert("Failed to assign rider and confirm steps");
    }
  };

  const handleMakeChanges = async (
    orderId: string,
    statusKey: string,
    value: string
  ) => {
    const res = await fetch(apiUrl("admin/order-status"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, statusKey, value }),
    });

    if (res.ok) {
      fetchOrders();
    } else {
      addAlert("Failed to update order status");
    }
  };

  const handleCancelStep = async (orderId: string, statusKey: string) => {
    // Reset the current step and all subsequent steps
    const stepOrder = ["confirmed", "preparing", "packing", "outForDelivery"];
    const currentStepIndex = stepOrder.indexOf(statusKey);

    // Create updates to clear current and subsequent steps
    const updates = stepOrder.slice(currentStepIndex).map((step) => ({
      statusKey: step,
      value: "",
    }));

    try {
      // Send multiple updates to clear the steps
      for (const update of updates) {
        const res = await fetch(apiUrl("admin/order-status"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            statusKey: update.statusKey,
            value: update.value,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to cancel ${update.statusKey}`);
        }
      }

      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel step:", error);
      addAlert("Failed to cancel step");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(apiUrl(`admin/cancel-order/${orderId}`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        addAlert("Order cancelled successfully");
        fetchOrders();
      } else {
        const error = await res.json();
        addAlert(error.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      addAlert("Failed to cancel order");
    }
  };

  const steps = [
    { key: "confirmed", label: "Order Confirmed" },
    { key: "preparing", label: "Preparing" },
    { key: "packing", label: "Packing" },
    {
      key: "outForDelivery",
      label:
        order.deliveryMethod === "delivery"
          ? "Out for Delivery"
          : "Order Prepared",
    },
  ];

  const actionButtons = [
    {
      key: "confirmed",
      completedText: "Confirmed",
      pendingText: "Confirm Order",
      messageText: "Order Confirmed",
      prerequisite: null,
      tooltips: {
        completed: "Click to cancel confirmation",
        pending: "Click to confirm order",
        disabled: null,
      },
    },
    {
      key: "preparing",
      completedText: "Preparing",
      pendingText: "Start Preparing",
      messageText: "Preparing Your Order",
      prerequisite: "confirmed",
      tooltips: {
        completed: "Click to cancel preparation",
        pending: "Click to start preparing",
        disabled: "Confirm order first",
      },
    },
    {
      key: "packing",
      completedText: "Packing",
      pendingText: "Start Packing",
      messageText: "Packing Your Order",
      prerequisite: "preparing",
      tooltips: {
        completed: "Click to cancel packing",
        pending: "Click to start packing",
        disabled: "Start preparing first",
      },
    },
    order.deliveryMethod === "delivery"
      ? {
          key: "outForDelivery",
          completedText: "Out for Delivery",
          pendingText: "Send for Delivery",
          messageText: "Your order is out for delivery",
          prerequisite: "packing",
          tooltips: {
            completed: "Click to cancel delivery",
            pending: "Click to send for delivery",
            disabled: "Complete packing first",
          },
        }
      : {
          key: "outForDelivery",
          completedText: "Order Prepared",
          pendingText: "Complete Preparation",
          messageText: "Your order is prepared",
          prerequisite: "packing",
          tooltips: {
            completed: "Click to cancel preparation",
            pending: "Click to send for preparation",
            disabled: "Complete packing first",
          },
        },
  ];

  return (
    <div
      key={order._id}
      className="bg-[#181c1f] border border-gray-600 rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#ff1200]">Order Details</h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-300">User:</span>
              <p className="">
                {order.userId && order.userId.name
                  ? order.userId.name
                  : order.userName || "Unknown"}
              </p>
            </div>

            <div>
              <div>
                <p className="font-semibold text-gray-300 text-sm sm:text-base">
                  Contact:
                </p>
                <p>{order.contact}</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                  <a
                    href={`tel:${order.contact}`}
                    className="bg-[#ff1200] flex justify-center items-center gap-2 px-3 py-2 rounded hover:bg-[#d81b00] transition text-white text-center text-sm sm:text-base"
                  >
                    <BiPhone /> Call
                  </a>
                  <a
                    href={`https://wa.me/${order.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 flex justify-center items-center gap-2 px-3 py-2 rounded hover:bg-green-700 transition text-white text-center text-sm sm:text-base"
                  >
                    <BsWhatsapp /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div>
              <span className="font-semibold text-gray-300 text-sm sm:text-base">
                Address:
              </span>
              <p className="text-gray-100 text-sm sm:text-base break-words">
                {order.location?.name ||
                  (order as Order & { address?: string }).address ||
                  "Address not available"}
              </p>
            </div>

            {order.deliveryMethod === "delivery" && (
              <div>
                <span className="font-semibold text-gray-300">
                  Assigned Rider:
                </span>
                <p className="">
                  {order.riderId && order.riderId.name
                    ? order.riderId.name
                    : "Not Assigned"}
                </p>
              </div>
            )}
            {order.deliveryMethod === "pickup" && (
              <div>
                <span className="font-semibold text-gray-300">Order Type:</span>
                <p className="">Pick Up</p>
              </div>
            )}

            {order.schedule?.isScheduled && (
              <div className="mb-2">
                <span className="font-semibold text-gray-300">
                  Scheduled For:
                </span>
                <p className="text-yellow-400 font-medium">
                  {order.schedule.scheduledFor}
                </p>
              </div>
            )}

            {order.riderId && order.riderId.phone && (
              <div>
                <span className="font-semibold text-gray-300">
                  Rider Contact:
                </span>
                <p className="">{order.riderId.phone}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg mb-3 text-[#ff1200]">
              Order Items:
            </h4>
            {!order.confirmed && (
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                title="Cancel this unconfirmed order"
              >
                Cancel Order
              </button>
            )}
          </div>
          <div className="bg-[#0e1113] border border-gray-600 rounded-lg p-4">
            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p>
                      <span className="text-gray-300">
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
                      <p className="text-yellow-400 text-sm italic mt-1">
                        Note: {item.specialNote}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-[#ff1200] ml-2">
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
          <div className="flex-col flex md:flex-row mb-10 sm:px-9">
            {steps.map(({ key, label }, i) => (
              <div
                key={key}
                className="flex items-center w-fit md:flex-row flex-col"
              >
                <div className="relative flex items-center md:justify-center">
                  <motion.div
                    initial={{
                      borderColor: "#6c6c6c",
                      backgroundColor: "#0e1113",
                    }}
                    animate={{
                      borderColor: (() => {
                        if (order[key]) return "#00ff3c";

                        const completedSteps = steps
                          .slice(0, i)
                          .every((step) => order[step.key]);
                        const isCurrentStep = completedSteps && !order[key];

                        return isCurrentStep ? "#00ff3c" : "#6c6c6c";
                      })(),
                      backgroundColor: order[key] ? "#00ff3c" : "#0e1113",
                    }}
                    className="border-gray-300 border rounded-full p-0.5"
                  >
                    <motion.p
                      initial={{ color: "#0e1113" }}
                      animate={{
                        color: order[key] ? "#000000" : "#0e1113",
                      }}
                    >
                      <BiCheck />
                    </motion.p>
                  </motion.div>

                  <motion.span
                    initial={{ color: "#ffffff" }}
                    animate={{
                      color: order[key] ? "#00ff3c" : "#ffffff",
                    }}
                    className="absolute md:top-[100%] left-[100%] text-xs md:mt-1 text-nowrap sm:ml-0 ml-3 md:left-auto"
                  >
                    {label}
                  </motion.span>
                </div>
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ backgroundColor: "#6c6c6c" }}
                    animate={{
                      backgroundColor: order[key] ? "#00ff3c" : "#6c6c6c",
                    }}
                    className="bg-gray-400 md:w-30 w-px h-10 md:h-px"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actionButtons.map((button) => {
              const isCompleted = order[button.key];
              const isDisabled = button.prerequisite
                ? !order[button.prerequisite]
                : false;

              const getTooltip = () => {
                if (isDisabled) return button.tooltips.disabled || "";
                return isCompleted
                  ? button.tooltips.completed
                  : button.tooltips.pending;
              };

              const getBackgroundColor = () => {
                if (isCompleted) return "#16a34a";
                if (button.prerequisite) {
                  return order[button.prerequisite] ? "#4b5563" : "#1f2937";
                }
                // For buttons with no prerequisite (like confirmed), use the ready state
                return "#4b5563";
              };

              const getHoverColor = () => {
                if (isCompleted) return "#22c55e"; // Lighter green for completed steps
                if (button.prerequisite) {
                  return order[button.prerequisite] ? "#ff1200" : "#1f2937";
                }
                // For buttons with no prerequisite (like confirmed), always allow hover
                return "#ff1200";
              };

              return (
                <motion.button
                  key={button.key}
                  onClick={() =>
                    isCompleted
                      ? handleCancelStep(order._id, button.key)
                      : handleMakeChanges(
                          order._id,
                          button.key,
                          button.messageText
                        )
                  }
                  animate={{
                    backgroundColor: getBackgroundColor(),
                  }}
                  whileHover={{
                    backgroundColor: getHoverColor(),
                  }}
                  className="w-full py-2 px-4 rounded-lg font-medium"
                  style={{
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                  disabled={isDisabled}
                  title={getTooltip()}
                >
                  {isCompleted ? button.completedText : button.pendingText}
                </motion.button>
              );
            })}
          </div>

          {order.deliveryMethod === "delivery" && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-300">
                Assign Rider:
              </h5>
              <select
                value={order.riderId?._id || ""}
                onChange={(e) => handleAssignRider(order._id, e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white"
              >
                <option value="" className="bg-[#0e1113]">
                  Select Rider
                </option>
                {riders.map((rider) => (
                  <option
                    key={rider._id}
                    value={rider._id}
                    className="bg-[#0e1113]"
                  >
                    {rider.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {!showActions && (
        <button
          onClick={() => handleDeleteFinishedOrder(order._id)}
          className="mt-6 w-full bg-red-600  py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          🗑 Delete
        </button>
      )}
    </div>
  );
};

export default AdminOrderCard;
