import { motion } from "motion/react";
import { NavLink, useLocation } from "react-router";
const AdminSideBar = () => {
  const location = useLocation();
  const routes = [
    { name: "Order", path: "/admin/orders" },
    { name: "Menu Items", path: "/admin/menu" },
    { name: "Accompaniments", path: "/admin/accompaniments" },
    { name: "Reservations", path: "/admin/reservations" },
    { name: "Roles", path: "/admin/roles" },
  ];

  return (
    <div className="fixed flex flex-col left-0 top-0 bottom-0 pt-5 w-65 border-r border-gray-500">
      <h1 className="mb-5 text-2xl text-[#ff1200] px-6 font-serif font-bold">
        DE BLISS
      </h1>
      <div className="flex-1 flex flex-col">
        <div className="px-2 flex flex-col gap-2 flex-1">
          {routes.map((route) => (
            <NavLink
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              key={route.path}
              to={route.path}
            >
              <motion.div
                whileHover={{
                  scale: 1.02,
                  backgroundColor:
                    location.pathname === route.path ||
                    (route.path === "/admin/orders" &&
                      location.pathname === "/admin")
                      ? "#ff1200"
                      : "#232426",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                animate={{
                  backgroundColor:
                    location.pathname === route.path ||
                    (route.path === "/admin/orders" &&
                      location.pathname === "/admin")
                      ? "#ff1200"
                      : "transparent",
                }}
                className="text-left py-2 px-3 rounded-lg"
              >
                {route.name}
              </motion.div>
            </NavLink>
          ))}
        </div>

        <NavLink
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          className="w-full"
          to="/"
        >
          <motion.div
            whileHover={{ backgroundColor: "#ff1200" }}
            className="text-left py-2 px-5"
          >
            Exit Admin
          </motion.div>{" "}
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSideBar;
