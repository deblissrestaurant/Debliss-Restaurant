import { NavLink, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  BiChevronDown,
  BiUserCircle,
  BiMenu,
  BiX,
  BiCalendar,
} from "react-icons/bi";
import { FiShoppingCart } from "react-icons/fi";
import { useCartStore } from "../../stores/cartStore";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";
import { usePopUpStore } from "../../stores/popUpStore";
import { useReservationStore } from "../../stores/reservationStore";

const Header = () => {
  const { setAuth } = useAuthStore();
  const location = useLocation();
  const { addPopUp } = usePopUpStore();
  const { setUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  const { clearCart } = useCartStore();
  const cart = useCartStore((state) => state.cart);
  const { reservations, fetchUserReservations, clearReservations } =
    useReservationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fetch user reservations when user changes
  useEffect(() => {
    if (user?.id || user?._id) {
      const userId = user._id || user.id;
      if (userId) {
        fetchUserReservations(userId);
      }
    }
  }, [user?.id, user?._id, fetchUserReservations]);

  const routes = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "MENU", path: "/menu" },
    user ? { name: "ORDERS", path: "/orders" } : null,
    user && user.role === "admin" ? { name: "ADMIN", path: "/admin" } : null,
    user && user.role === "rider" ? { name: "RIDER", path: "/rider" } : null,
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popupRef.current && popupRef.current.contains(target)) {
        return;
      }
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick, true);
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (mobileMenuRef.current && mobileMenuRef.current.contains(target)) {
        return;
      }
      setIsMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick, true);
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{
          background: "linear-gradient(to bottom, #0e1113, transparent)",
        }}
        animate={{
          background: isMobileMenuOpen
            ? "linear-gradient(to bottom, #0e1113, #0e1113)"
            : "linear-gradient(to bottom, #0e1113, transparent)",
        }}
        transition={{ ease: "easeInOut" }}
        className="z-20 flex fixed top-0 w-full h-14 sm:h-16 items-center px-3 sm:px-6"
      >
        {/* Mobile Layout */}
        <div className="flex sm:hidden w-full items-center justify-between">
          <NavLink
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            to="/"
          >
            <span className=" font-serif text-[#ff2100] font-bold">
              DE BLISS
            </span>
          </NavLink>
          <div className="flex items-center gap-2">
            {user &&
              reservations.length > 0 &&
              location.pathname !== "/current-reservations" && (
                <div className="relative">
                  <div className="bg-[#ff1200] rounded-full absolute size-3 flex justify-center items-center right-[-5%] top-[-10%] z-10">
                    <p className="text-xs leading-none">
                      {reservations.length}
                    </p>
                  </div>
                  <NavLink
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                    to="/current-reservations"
                  >
                    <button className="cursor-pointer flex items-center py-1 px-2 border border-[#ff1200] rounded-lg bg-[#0e1113]">
                      <BiCalendar size={16} />
                    </button>
                  </NavLink>
                </div>
              )}
            {user && cart.length > 0 && location.pathname !== "/cart" && (
              <div className="relative">
                <div className="bg-[#ff1200] rounded-full absolute size-3 flex justify-center items-center right-[-5%] top-[-10%] z-10">
                  <p className="text-xs leading-none">{cart.length}</p>
                </div>
                <NavLink
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                  to="/cart"
                >
                  <button className="cursor-pointer flex items-center py-1 px-2 border border-[#ff1200] rounded-lg bg-[#0e1113]">
                    <FiShoppingCart size={16} />
                  </button>
                </NavLink>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-[#121516] rounded-lg transition"
            >
              {isMobileMenuOpen ? <BiX size={24} /> : <BiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex w-full items-center">
          <div className="flex justify-start flex-1">
            <NavLink
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              to="/"
            >
              <span className=" font-serif text-[#ff2100] font-bold">
                DE BLISS
              </span>
            </NavLink>
          </div>
          <div className="gap-2 sm:gap-4 flex justify-center flex-1">
            {routes
              .filter(
                (route) => route !== null && route.path !== location.pathname
              )
              .map(
                (route) =>
                  route && (
                    <NavLink
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                      key={route.path}
                      to={route.path}
                    >
                      <button className="cursor-pointer text-xs sm:text-sm font-medium hover:text-[#ff1200] transition">
                        {route.name}
                      </button>
                    </NavLink>
                  )
              )}
          </div>
          <div className="flex justify-end flex-1">
            {user ? (
              <div className="flex relative min-w-0 justify-end gap-2 sm:gap-2">
                {reservations.length > 0 &&
                  location.pathname !== "/current-reservations" && (
                    <div className="relative">
                      <div className="bg-[#ff1200] rounded-full absolute size-3 sm:size-4 flex justify-center items-center right-[-5%] top-[-10%] z-10">
                        <p className="text-xs leading-none">
                          {reservations.length}
                        </p>
                      </div>
                      <NavLink
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                        to="/current-reservations"
                      >
                        <button className="cursor-pointer flex items-center py-1 px-2 sm:py-2 sm:px-4 border border-[#ff1200] rounded-lg gap-1 sm:gap-2 bg-[#0e1113] text-xs sm:text-sm">
                          <BiCalendar size={16} className="sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Reservations</span>
                        </button>
                      </NavLink>
                    </div>
                  )}
                {cart.length > 0 && location.pathname !== "/cart" && (
                  <div className="relative">
                    <div className="bg-[#ff1200] rounded-full absolute size-3 sm:size-4 flex justify-center items-center right-[-5%] top-[-10%] z-10">
                      <p className="text-xs leading-none">{cart.length}</p>
                    </div>
                    <NavLink
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                      to="/cart"
                    >
                      <button className="cursor-pointer flex items-center py-1 px-2 sm:py-2 sm:px-4 border border-[#ff1200] rounded-lg gap-1 sm:gap-2 bg-[#0e1113] text-xs sm:text-sm">
                        <FiShoppingCart size={16} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Cart</span>
                      </button>
                    </NavLink>
                  </div>
                )}
                <button
                  ref={buttonRef}
                  className="flex items-center cursor-pointer gap-1"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <BiUserCircle size={24} className="sm:w-7 sm:h-7" />
                  <BiChevronDown size={16} className="sm:w-5 sm:h-5" />
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  className="absolute w-full min-w-32 overflow-hidden top-[100%] mt-2 sm:mt-4 right-0"
                  ref={popupRef}
                >
                  <div className="px-3 sm:px-4 py-2 rounded-lg bg-[#242729] divide-y gap-2 text-sm">
                    <p className="pb-2">{user.name}</p>
                    <button
                      onClick={() => {
                        setUser(null);
                        navigate("/");
                        clearCart();
                        clearReservations();
                      }}
                      className="pt-2 text-left w-full hover:text-[#ff1200] transition"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={() => {
                    setAuth("login");
                    addPopUp();
                  }}
                  className="w-16 sm:w-20 py-1 sm:py-2 rounded-lg bg-[#000000] border border-[#ff2100] cursor-pointer text-xs sm:text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuth("register");
                    addPopUp();
                  }}
                  className="w-16 sm:w-20 py-1 sm:py-2 rounded-lg bg-[#ff2100] border border-[#ffffff] cursor-pointer text-xs sm:text-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-14 right-0 bottom-0 w-64 bg-[#0e1113]  z-30 sm:hidden"
        ref={mobileMenuRef}
      >
        <div className="flex flex-col p-4 gap-4 ">
          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            {routes.map(
              (route) =>
                route !== null && (
                  <NavLink
                    key={route?.path}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                    to={route?.path}
                  >
                    <motion.div
                      whileHover={{
                        scale: 1.02,
                        backgroundColor:
                          location.pathname === route?.path
                            ? "#ff1200"
                            : "#232426",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      animate={{
                        backgroundColor:
                          location.pathname === route?.path ||
                          (route?.path === "/admin/orders" &&
                            location.pathname === "/admin")
                            ? "#ff1200"
                            : "transparent",
                      }}
                      className="text-left py-2 px-3 rounded-lg"
                    >
                      {route?.name}
                    </motion.div>
                  </NavLink>
                )
            )}
          </div>

          {/* User Section */}
          {user ? (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-600">
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <BiUserCircle size={24} />
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  setUser(null);
                  clearCart();
                  clearReservations();
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-lg hover:bg-gray-800 transition text-red-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-600">
              <button
                onClick={() => {
                  setAuth("login");
                  addPopUp();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-lg bg-[#000000] border border-[#ff2100] text-center"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuth("register");
                  addPopUp();
                  setIsMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-lg bg-[#ff2100] border border-[#ffffff] text-center"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
