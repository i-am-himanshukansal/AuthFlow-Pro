import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const {isAuthenticated,setIsAuthenticated,user,setUser} = useContext(Context);
  const navigateTo = useNavigate();
  const {
    register,
    handleSubmit,
    formState : {errors}
  } = useForm();

  const handleRegistration = async(data)=>{
    data.phone = `+91${data.phone}`;
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,data,{
      withCredentials : true,
      headers : {"Content-Type" : "application/json"}
    }).then((res)=>{
      toast.success(res.data.message);
      navigateTo(`/otp-verification/${data.email}/${data.phone}`);
    }).catch((error)=>{
      toast.error(error.response?.data?.message || "Registration failed");
    })
  }
  return (
    <div>
      <form 
        className="auth-form"
        onSubmit={handleSubmit((data)=>handleRegistration(data))}>
          <h2>Register</h2>
          <input type="text" placeholder="name" {...register("name",{required : true})} />
          <input type="email" placeholder="email" {...register("email",{required : true})} />
          <div>
            <span>+91</span>
            <input type="number" placeholder="phone" {...register("phone",{required : true})} />
          </div>
          <input type="password" placeholder="password" {...register("password",{required : true})} />
          <div className="verification-method">
            <p>select Verification Method</p>
            <div className="wrapper">
              <label>
                <input 
                  type="radio"  
                  name="verificationMethod" 
                  value={"email"} 
                  {...register("verificationMethod",{required : true})} />
                  Email
              </label>
              <label>
                <input 
                  type="radio"  
                  name="verificationMethod" 
                  value={"phone"} 
                  {...register("verificationMethod",{required : true})} />
                  Phone
              </label>
            </div>
          </div>
          <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
