import "../styles/Footer.css";
import { Link } from "react-router-dom";
import git from "../assets/git.png";
import linkedin from "../assets/linkedin.png";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">

        <div className="footer-logo">
          <h2>MERN Authentication System</h2>
          <p>
            A secure authentication system built using the MERN stack with OTP
            verification and password recovery.
          </p>
        </div>

        <div className="footer-social">
          <h3>Connect With Me</h3>
          <div className="social-icons">

            <Link
              to="https://www.linkedin.com/in/himanshu-kansal-0493a223a/"
              target="_blank"
              className="social-link"
            >
              <img src={linkedin} alt="LinkedIn" />
            </Link>

            <Link
              to="https://github.com/"
              target="_blank"
              className="social-link"
            >
              <img src={git} alt="GitHub" />
            </Link>

          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MERN Authentication. All Rights Reserved.</p>
        <p>Made by Himanshu Kansal (Backend Developer)</p>
      </div>
    </footer>
  );
};

export default Footer;
