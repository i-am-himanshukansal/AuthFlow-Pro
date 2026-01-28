import React, { useContext, useState } from "react";
import "../styles/ResetPassword.css";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const ResetPassword = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await axios.post(
        `http://localhost:4000/api/v1/user/password/reset/${token}`,
        { password, confirmPassword },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res)=>{
        toast.success(res.data.message);
        setIsAuthenticated(true);
        setUser(res.data.user);

        // Clear inputs after success
        setPassword("");
        setConfirmPassword("");
      }).catch((error) => {
        toast.error(error.response?.data?.message || "Password reset failed");
      });
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <p>Enter your new password below</p>

        <form onSubmit={handleResetPassword} className="reset-password-form">
          <input
            type="password"
            className="reset-input"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            className="reset-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="reset-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
