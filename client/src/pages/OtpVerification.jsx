import React, { useContext, useState } from "react";
import "../styles/OtpVerification.css";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const OtpVerification = () => {
  const {isAuthenticated,setIsAuthenticated,user,setUser} = useContext(Context);
  const {email,phone} = useParams();
  const [otp,setOtp] = useState(["","","","",""]);

  const handleChange = (value,index)=>{
    if(! /^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if(value && index<otp.length-1){
      document.getElementById(`otp-${index+1}`).focus();
    }
  };
  const handleKeyDown = (e,index)=>{
    if(e.key ==="Backspace" && !otp[index] && index>0){
      document.getElementById(`otp-${index-1}`).focus();
    } 
  }
  const handleOtpVerification = async(e)=>{
    e.preventDefault();
    const enteredOtp = otp.join("");
    const data = {
      email,
      phone,
      otp : enteredOtp
    }
    try{
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/otp-verification`,
                                        data,
                                        {
                                          withCredentials : true,
                                          headers : {"Content-Type" : "application/json"}
                                        }
                                      );
      toast.success(response.data.message);
      setIsAuthenticated(true);
      setUser(response.data.user);
      return <Navigate to={"/"}/>;
    }catch(error){
      toast.error(error.response?.data?.message || "OTP Verification failed");
      setIsAuthenticated(false);
      setUser(null);
    }
  };
  if(isAuthenticated){
    return <Navigate to={"/"}/>;
  }
  return (
    <div className="otp-verification-page">
      <div className="otp-container">
        <h1>OTP verification</h1>
        <p>Enter the 5 digit otp sent to your email or phone. </p>
        <form onSubmit={handleOtpVerification} className="otp-from">
          <div className="otp-input-container">
            {otp.map((value,index)=>{
              return (
                <input 
                  type="text" 
                  maxLength="1" 
                  key={index}
                  onChange={(e)=>handleChange(e.target.value,index)}
                  onKeyDown={(e)=>handleKeyDown(e,index)}
                  className="otp-input"
                  id={`otp-${index}`}
                  value={value}
                  />
              )
            })}
          </div>
          <button className="verify-button" type="submit">Verify OTP</button>
        </form>
      </div>
    </div>
  )
};

export default OtpVerification;
