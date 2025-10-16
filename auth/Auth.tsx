import Login from "./Login";
import Register from "./Register";
import { IoClose } from "react-icons/io5";
import { motion } from "motion/react";
import { useAuthStore } from "../stores/authStore";
import { usePopUpStore } from "../stores/popUpStore";

const Auth = () => {
  const { setAuth } = useAuthStore();
  const auth = useAuthStore((state) => state.authType);

  const { removePopUp } = usePopUpStore();

  return (
    <motion.div
      initial={{ visibility: "hidden" }}
      animate={auth && { visibility: "visible" }}
      className="z-20 fixed top-0 flex justify-center items-center h-screen w-full bg-black/25 overflow-hidden"
      aria-modal="true"
      role="dialog"
    >
      <motion.main
        initial={{ scale: 0, opacity: 0 }}
        animate={
          auth && {
            scale: 1,
            opacity: 1,
            transition: { delay: 0.2 },
          }
        }
        className="flex justify-center items-center relative bg-[#0e1113] sm:w-125 h-fit py-4 w-80 rounded-lg"
      >
        <button
          className="absolute top-4 right-4 cursor-pointer"
          onClick={() => {
            setAuth("");
            removePopUp();
          }}
        >
          <IoClose color="white" size={30} />
        </button>
        {auth === "login" && <Login />}
        {auth === "register" && <Register />}
      </motion.main>
    </motion.div>
  );
};

export default Auth;
