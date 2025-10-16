import { motion } from "motion/react";
import { useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useCartStore } from "../../stores/cartStore";
import { usePopUpStore } from "../../stores/popUpStore";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";
import type { MenuItem } from "../../Interfaces/Interfaces";

const FoodPopUp = ({
  close,
  isOrdering,
  menuItem,
}: {
  close: () => void;
  isOrdering: boolean;
  menuItem: MenuItem;
}) => {
  const { addToCart } = useCartStore();
  const cart = useCartStore((state) => state.cart);
  const user = useUserStore((state) => state.user);
  const { setAuth } = useAuthStore();
  const { addPopUp, removePopUp } = usePopUpStore();

  const cartItem = cart.find((item) => item.menuItem._id === menuItem._id);
  const [quantity, setQuantity] = useState(cartItem ? cartItem.quantity : 1);
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<{
    [key: string]: boolean;
  }>({});
  const [specialNote, setSpecialNote] = useState("");

  const calculateTotalPrice = () => {
    let total = menuItem.price;
    if (menuItem.accompaniments) {
      menuItem.accompaniments.forEach((acc) => {
        if (selectedAccompaniments[acc.name]) {
          total += acc.price;
        }
      });
    }
    return total;
  };

  const handleAccompanimentChange = (accName: string) => {
    setSelectedAccompaniments((prev) => ({
      ...prev,
      [accName]: !prev[accName],
    }));
  };

  const handleAddToCart = () => {
    // Check if user is signed in
    if (!user) {
      setAuth("login");
      addPopUp();
      return;
    }

    const totalPrice = calculateTotalPrice();
    const selectedAccs =
      menuItem.accompaniments?.filter(
        (acc) => selectedAccompaniments[acc.name]
      ) || [];

    addToCart(
      menuItem._id,
      menuItem.name,
      menuItem.description || "",
      totalPrice.toFixed(2),
      quantity,
      selectedAccs.length > 0 ? selectedAccs : undefined,
      specialNote || undefined
    );

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-end justify-center">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isOrdering && { y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="relative w-full sm:max-w-lg max-h-[90vh] bg-gradient-to-b from-[#1a1d21] to-[#0e1113] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Hero Image Section */}
        <div className="relative h-48 sm:h-52 flex-shrink-0 overflow-hidden">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Floating Close Button */}
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-200"
            onClick={() => {
              close();
              removePopUp();
            }}
          >
            <IoClose size={20} color="#ff1200" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 py-2 px-4 space-y-2 overflow-y-auto">
          {/* Header with better typography */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {menuItem.name}
            </h1>
            <p className="text-2xl font-bold bg-[#ff1200] bg-clip-text text-transparent">
              GH₵{calculateTotalPrice().toFixed(2)}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {menuItem.description}
            </p>
          </div>

          {/* Modern Accompaniments Section */}
          {menuItem.accompaniments && menuItem.accompaniments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-[#ff2100] rounded-full"></span>
                Add-ons
              </h3>
              <div className="grid gap-2 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {menuItem.accompaniments.map((acc) => (
                  <label
                    key={acc.name}
                    className="flex items-center justify-between p-2 bg-[#1a1d21] rounded-lg border border-gray-700 hover:border-[#ff2100]/50 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAccompaniments[acc.name] || false}
                        onChange={() => handleAccompanimentChange(acc.name)}
                        className=" appearance-none w-4 h-4 bg-[#0e1113] border-gray-500 checked:border-[#ff2100] checked:border-4 rounded-full border-2 cursor-pointer "
                      />

                      <span className="text-sm text-white group-hover:text-[#ff2100] transition-colors duration-200">
                        {acc.name}
                      </span>
                    </div>
                    {acc.price > 0 && (
                      <span className="text-xs text-gray-400 font-medium">
                        +GH₵{acc.price.toFixed(2)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Compact Special Instructions */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300">
              Special Instructions
            </label>
            <motion.textarea
              whileFocus={{
                borderColor: "#ff2100",
                boxShadow: "0 0 0 2px rgba(255, 33, 0, 0.1)",
              }}
              placeholder="Any special requests..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="w-full p-3 bg-[#1a1d21] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 resize-none focus:outline-none transition-all duration-200"
              rows={1}
            />
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-700">
          <div className="flex items-center justify-between gap-3">
            {/* Compact quantity selector */}
            <div className="flex h-10 items-center bg-[#1a1d21] rounded-lg border border-gray-700 overflow-hidden">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="p-2 hover:bg-[#ff2100] transition-colors duration-200 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <BiMinus className="w-4 h-4" />
              </button>
              <div className="px-3 py-2 min-w-[2.5rem] text-center font-semibold text-white text-sm">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-[#ff2100] transition-colors duration-200"
              >
                <BiPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Compact add to cart button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="flex-1 h-10 px-4 bg-[#ff1200] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-1"
            >
              <span className="text-sm">Add to Cart</span>
              <span className="text-xs opacity-90">
                • GH₵{(calculateTotalPrice() * quantity).toFixed(2)}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FoodPopUp;
