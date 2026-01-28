import React from "react";
import "../styles/Creator.css";
import hkansal from "../assets/hk.jpeg";

const Creator = () => {
  return (
    <section className="creator-section" id="creator">
      <div className="creator-page">
        <div className="creator-card">
          <div className="creator-image">
            <img src={hkansal} alt="Himanshu Kansal" />
          </div>

          <div className="creator-info">
            <h1>Himanshu Kansal</h1>
            <h4>Creator of this Project</h4>

            <p>
              Hello! I am Himanshu Kansal, an aspiring MERN stack developer. I built
              this authentication system to gain hands-on experience with real-
              world authentication workflows.
            </p>

            <p>
              This project uses the MERN stack along with secure APIs for OTP
              verification and password recovery. I worked with React, Node.js,
              Express.js, MongoDB, JWT, Axios, cookies, Nodemailer, and Twilio.
            </p>

            <div className="social-links">
              <a
                href="https://github.com/i-am-himanshukansal"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/himanshu-kansal-0493a223a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Creator;
