import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, user } =
    useContext(Context);
  const navigateTo = useNavigate();

  const logOut = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setIsAuthenticated(false);
      setUser(null);
      navigateTo("/auth");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          AuthFlow <span>Pro</span>
        </div>

        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><a href="#about">About</a></li>
          <li><a href="#technologies">Technologies</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">
                Hi, {user?.name || "User"}
              </span>
              <button onClick={logOut} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
