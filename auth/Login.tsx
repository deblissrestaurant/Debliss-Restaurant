import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../services/api";
import { usePopUpStore } from "../stores/popUpStore";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";

const Login = () => {
  const { setAuth } = useAuthStore();
  const { setUser } = useUserStore();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { removePopUp } = usePopUpStore();
  const { addAlert } = usePopUpStore();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await login(name, password);

    if (res.success) {
      const user = res.user;
      setUser(user);

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "rider") {
        navigate("/rider");
      }
      setAuth("");
      removePopUp();
    } else {
      addAlert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="w-full gap-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold">Login</h1>
      <form
        onSubmit={handleLogin}
        className="w-full flex flex-col items-center gap-4"
      >
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        <button type="submit" className="bg-[#ff2100] px-4 py-2 rounded-full">
          Continue
        </button>
      </form>
      <p className="text-gray-400">
        Don't have an account?{" "}
        <motion.span
          whileHover={{ color: "#ff2100", cursor: "pointer" }}
          transition={{ duration: 0.1 }}
          onClick={() => setAuth("register")}
        >
          Sign Up
        </motion.span>
      </p>
      <p className="text-gray-400">
        Forgot your password?{" "}
        <motion.span
          whileHover={{ color: "#ff2100", cursor: "pointer" }}
          transition={{ duration: 0.1 }}
          onClick={() => navigate("/auth/forgot-password")}
        >
          Reset Password
        </motion.span>
      </p>
    </div>
  );
};

export default Login;
