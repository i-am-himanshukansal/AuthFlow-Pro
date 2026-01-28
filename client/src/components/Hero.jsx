import React, { useContext } from "react";
import "../styles/Hero.css";
import devImage from "../assets/backend_developer.png";
import { Context } from "../main";

const Hero = () => {
  const { user } = useContext(Context);

  return (
    <div className="hero-section">  
      <img src={devImage} alt="MERN developer illustration" />

      <h4>Hello, {user ? user.name.toUpperCase() : "HIMANSHU KANSAL"}</h4>

      <h1>MERN Authentication System</h1>

      <p>
        A full-stack authentication project built using the MERN stack.
      </p>

      <p>
        <b className="bold">
          Implemented secure user registration, login, OTP verification, and
        forgot/reset password flows.
        </b>
      </p>

      <p>
        Technologies used: <b className="bold">React, Node.js, Express.js, MongoDB, JWT, Axios, and
        cookies</b> — focusing on real-world authentication and frontend-backend
        integration.
      </p>
    </div>
  );
};

export default Hero;
