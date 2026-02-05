import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";

const Login = () => {
const {isAuthenticated,setIsAuthenticated,user,setUser} = useContext(Context);
  const navigateTo = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const handleLogin = async (data)=>{
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,data,{
      withCredentials : true,
      headers: {
        "Content-Type" : "application/json",

      }
    }).then((res)=>{
      toast.success(res.data.message);
      setIsAuthenticated(true);
      setUser(res.data.user);
      navigateTo("/");
    })
    .catch((error) => {
      toast.error(error.response?.data?.message || "Login failed");
    })
  }
  return (<>
      <form className="auth-form" onClick={handleSubmit((data)=>handleLogin(data))}>
        <h2>Login</h2>
        <input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />

      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      <p className="forgot-password">
          <Link to="/password/forgot">Forgot Your Password</Link>
        </p>
        <button type="submit">Login</button>
      </form>
    </>)
};

export default Login;