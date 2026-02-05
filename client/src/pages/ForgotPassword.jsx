import React, { useContext, useState } from "react";
import "../styles/ForgotPassword.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  // const {isAuthenticated} = useContext(Context);
  const [email,setEmail]  = useState("");
  const handleForgotPassword = async(e)=>{
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/password/forgot`,
      {email},
      {
        withCredentials : true,
        headers : {
          "Content-Type": "application/json",
        }
      }
    ).then((res)=>{
      toast.success(res.data.message);
      // const {token} = res.data;
      // return <Navigate to={`/password/reset/${token}`}/>
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Password reset failed")
    })
    setEmail("");
  };
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>enter your email address to recieve a password reset token.</p>
        <form onSubmit={handleForgotPassword}>
          <input 
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="forgot-input"
          />
          <Link to="/auth" className="link-btn">Go to Login Page</Link>
          <button type="submit" className="forgot-btn">Send Reset Token</button>
        </form> 
      </div>
    </div>
  )
};

export default ForgotPassword;
