import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePopUpStore } from "../stores/popUpStore";
import { useAuthStore } from "../stores/authStore";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { apiUrl } from "../config/constants";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const { addPopUp } = usePopUpStore();

  useEffect(() => {
    // Get email from navigation state
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      // If no email provided, redirect back to forgot password
      setMessage("No email provided. Redirecting to forgot password...");
      setTimeout(() => {
        navigate("/auth/forgot-password");
      }, 2000);
    }
  }, [location.state, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(apiUrl("reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
          setAuth("login");
          addPopUp();
        }, 2000);
      } else {
        setMessage(data.error || "Password reset failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full gap-8 flex flex-col items-center h-screen justify-center">
      <h1 className="text-3xl font-semibold">Reset Password</h1>
      <p className="text-gray-600 text-center">
        Enter your new password for: <strong>{email}</strong>
      </p>
      <form
        onSubmit={handleResetPassword}
        className="flex flex-col items-center gap-4 w-full max-w-md"
      >
        <div className="relative w-3/4">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className="py-2 px-4 border rounded w-full pr-12"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
          >
            {showNewPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        </div>
        <div className="relative w-3/4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm New Password"
            className="py-2 px-4 border rounded w-full pr-12"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
          >
            {showConfirmPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white py-2 px-6 rounded"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && <p className="text-gray-700 text-center">{message}</p>}
      </form>
    </div>
  );
}
