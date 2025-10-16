import { motion } from "motion/react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { usePopUpStore } from "../stores/popUpStore";
import { useAuthStore } from "../stores/authStore";
import { apiUrl } from "../config/constants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { addPopUp } = usePopUpStore();

  // Step 1: Send reset code to email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(apiUrl("forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setCodeSent(true);
        setMessage("Code sent! Check your email.");
      } else {
        setMessage(data.message || "Failed to send code.");
      }
    } catch (err) {
      console.error(err);

      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the code entered by user
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(apiUrl("verify-reset-code"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Code verified. Redirecting...");
        setTimeout(() => {
          navigate("/auth/reset-password", { state: { email } });
        }, 1500);
      } else {
        setMessage(data.error || "Invalid or expired code.");
      }
    } catch (err) {
      console.error(err);

      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Forgot Password
        </h1>

        {!codeSent ? (
          <form
            onSubmit={handleSendCode}
            className="flex flex-col gap-4 w-full"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="py-3 px-4 border rounded-lg w-full text-base focus:outline-none focus:border-red-600 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white py-3 px-6 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyCode}
            className="flex flex-col gap-4 w-full"
          >
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter the 6-digit code"
                className="py-3 px-4 border rounded-lg w-full text-base focus:outline-none focus:border-green-600 transition-colors text-center tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 text-center">
                Code sent to {email}
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {message && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-700 text-center text-sm">{message}</p>
          </div>
        )}

        <motion.p
          whileHover={{ color: "#ff2100", cursor: "pointer" }}
          transition={{ duration: 0.1 }}
          onClick={() => {
            navigate("/");
            setAuth("login");
            addPopUp();
          }}
          className="text-gray-400 text-center text-sm sm:text-base mt-6 cursor-pointer"
        >
          Back to Login
        </motion.p>
      </div>
    </div>
  );
}
