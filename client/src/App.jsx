import React, { useEffect, useState, useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import OtpVerification from "./pages/OtpVerification";

const App = () => {
  console.log("App component rendered");
  const { setIsAuthenticated, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log("Fetching user data...");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getUser`,
          { withCredentials: true }
        );

        setIsAuthenticated(true);
        setUser(res.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/otp-verification/:email/:phone"
          element={<OtpVerification />}
        />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
};

export default App;
