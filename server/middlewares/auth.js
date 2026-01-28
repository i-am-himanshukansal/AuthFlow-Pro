import { catchAsyncError } from "./catchAsyncErrors.js";
import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";


export const isAuthenticated = catchAsyncError(async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Login first to access this resource",401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
})

export const isLogOut = catchAsyncError(async (req,res,next)=>{
    const {token} = req.cookies;
    if(token){
        return next(new ErrorHandler("You are already logged in",400));
    }   
    next();
})