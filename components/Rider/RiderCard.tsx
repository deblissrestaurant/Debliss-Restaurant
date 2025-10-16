import { BiCheck, BiPhone } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import type { Order } from "../../Interfaces/Interfaces";
import { motion } from "motion/react";
import { usePopUpStore } from "../../stores/popUpStore";

interface RiderCardProps {
  order: Order;
  showActions?: boolean;
}

const RiderCard = ({ order, showActions = false }: RiderCardProps) => {
  const steps = [
    { key: "confirmed", label: "Order Confirmed" },
    { key: "preparing", label: "Preparing" },
    { key: "packing", label: "Packing" },
    { key: "outForDelivery", label: "Out for Delivery" },
  ];

  const { addAlert } = usePopUpStore();

  return (
    <div
      key={order._id}
      className="bg-[#181c1f] border border-gray-600 rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4 text-[#ff1200]">
            Order Details
          </h3>

          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-300">Customer:</span>
              <p className="text-white">
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
                <p className="text-white">{order.contact || "N/A"}</p>
                {order.contact && (
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
                )}
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
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${order.location.lat},${order.location.lon}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-[#ff1200] hover:text-[#d81b00] underline transition-colors duration-200"
              >
                <p>View Route</p>
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-3 text-[#ff1200]">
            Order Items:
          </h4>
          <div className="bg-[#0e1113] border border-gray-600 rounded-lg p-4">
            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <p>
                    <span className="text-gray-300">
                      {item.menuItem && item.menuItem.name
                        ? item.menuItem.name
                        : "Unknown Item"}
                    </span>
                    {item.accompaniments && (
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
                  <span className="font-semibold text-[#ff1200]">
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
        <div className="mt-6">
          <button
            onClick={() => {
              // Handle delivery confirmation
              addAlert(
                "Delivery confirmed! This order will be moved to finished deliveries."
              );
            }}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Confirm Delivery
          </button>
        </div>
      )}
    </div>
  );
};

export default RiderCard;
