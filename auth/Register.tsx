import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { signup } from "../services/api";
import { usePopUpStore } from "../stores/popUpStore";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { apiUrl } from "../config/constants";

const Register = () => {
  const { setAuth } = useAuthStore();
  const { removePopUp } = usePopUpStore();
  const { setUser } = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const { addAlert } = usePopUpStore();

  const [usernameError, setUsernameError] = useState("");
  // const [role, setRole] = useState("user");
  const navigate = useNavigate();

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      setUsernameError("");
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError("");

    try {
      const response = await fetch(apiUrl("check-username"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsernameAvailable(data.available);
        if (!data.available) {
          setUsernameError("Username is already taken");
        }
      } else {
        setUsernameError("Error checking username");
      }
    } catch (error) {
      console.error("Username check error:", error);
      setUsernameError("Error checking username");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounced username checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (name.trim()) {
        checkUsernameAvailability(name.trim());
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [name]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signup(name, email, password, phone); // your API should handle this

    if (res.success) {
      const user = res.user;
      // The setUser function now handles localStorage automatically
      setUser(user);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }

      setAuth("");
      removePopUp();
    } else {
      addAlert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="w-full gap-8 flex flex-col items-center">
      <h1 className="text-4xl font-semibold">Sign Up</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          // Check if username is available
          if (usernameAvailable !== true) {
            addAlert("Please choose an available username.");
            return;
          }

          // Username length validation
          if (name.length < 3) {
            addAlert("Username must be at least 3 characters long.");
            return;
          }

          // Ghanaian phone number validation: starts with 0, followed by 9 digits, or +233 then 9 digits
          const ghanaPhoneRegex = /^(0\d{9}|(\+233\d{9}))$/;
          if (!ghanaPhoneRegex.test(phone)) {
            addAlert("Please enter a valid Ghanaian phone number.");
            return;
          }
          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            addAlert("Please enter a valid email address.");
            return;
          }
          handleSignup(e);
        }}
        className="w-full flex flex-col items-center gap-4"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Username"
          className={`py-2 px-4 w-3/4 bg-[#181b1e] border-2 rounded-full ${
            name.length > 0
              ? usernameAvailable === true
                ? "border-green-500"
                : usernameAvailable === false
                ? "border-red-500"
                : "border-[#ff2100]"
              : "border-[#ff2100]"
          }`}
        />
        {name.length > 0 && (
          <div className="w-3/4 px-2">
            {isCheckingUsername && (
              <span className="text-blue-400 text-sm flex items-center gap-1">
                Checking availability...
              </span>
            )}
            {!isCheckingUsername && usernameAvailable === true && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                Username is available
              </span>
            )}
            {!isCheckingUsername && usernameAvailable === false && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                {usernameError}
              </span>
            )}
            {name.length > 0 && name.length < 3 && (
              <span className="text-yellow-500 text-sm">
                Username must be at least 3 characters
              </span>
            )}
          </div>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
          <span className="text-red-500 text-sm w-3/4 px-2">
            *Please enter a valid email.
          </span>
        )}
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        {phone && !/^(0\d{9}|(\+233\d{9}))$/.test(phone) && (
          <span className="text-red-500 text-sm w-3/4 px-2">
            *Please enter a valid phone number.
          </span>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="py-2 px-4 w-3/4 bg-[#181b1e] border-2 border-[#ff2100] rounded-full"
        />
        <button
          type="submit"
          disabled={usernameAvailable !== true || name.length < 3}
          className={`px-4 py-2 rounded-full transition-all ${
            usernameAvailable === true && name.length >= 3
              ? "bg-[#ff2100] hover:bg-[#d81b00] cursor-pointer"
              : "bg-gray-500 cursor-not-allowed opacity-50"
          }`}
        >
          Continue
        </button>
      </form>
      <p className="text-gray-400">
        Already have an account?{" "}
        <motion.span
          whileHover={{ color: "#ff2100", cursor: "pointer" }}
          transition={{ duration: 0.1 }}
          onClick={() => setAuth("login")}
        >
          Login
        </motion.span>
      </p>
    </div>
  );
};

export default Register;
