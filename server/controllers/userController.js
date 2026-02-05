import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { ErrorHandler } from "../middlewares/error.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";

let twilioClient = null;

const getTwilioClient = () => {
    if (!twilioClient) {
        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        if (!accountSid || !authToken) {
            throw new Error("Twilio credentials not configured.");
        }

        twilioClient = twilio(accountSid, authToken);
    }
    return twilioClient;
};

const validateE164PhoneNumber = (phone) => {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
};

const generateOtpTwiML = (verificationCode) => {
    const digits = verificationCode.toString().split("");
    const formattedDigits = digits.join(", ");

    return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
    <Say voice="alice" language="en-US">Hello! This is your verification call.</Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-US">Your verification code is:</Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-US">${formattedDigits}</Say>
    <Pause length="2"/>
    <Say voice="alice" language="en-US">I repeat, your verification code is:</Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-US">${formattedDigits}</Say>
    <Pause length="1"/>
    <Say voice="alice" language="en-US">Thank you. Goodbye!</Say>
    </Response>`;
};

// const generateOtpTwiML = (verificationCode) => {
//     const digits = verificationCode.toString().split("");
//     const formattedDigits = digits.join(", ");

//     return `Your verification code is: ${verificationCode}. Expire in 10 minutes.
//     `;
// };
export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, email, phone, password, verificationMethod } = req.body;

        if (!name || !email || !phone || !password || !verificationMethod) {
            return next(new ErrorHandler("All fields are required.", 400));
        }

        if (!validateE164PhoneNumber(phone)) {
            return next(new ErrorHandler("Invalid phone number format.", 400));
        }

        const existingUser = await User.findOne({
            $or: [
                { email, accountVerified: true },
                { phone, accountVerified: true },
            ],
        });

        if (existingUser) {
            return next(new ErrorHandler("User already exists.", 400));
        }

        const registrationAttemptsByUser = await User.find({
            phone,
            accountVerified: false,
        });

        if (registrationAttemptsByUser.length >= 3) {
            return next(new ErrorHandler("Too many attempts.", 400));
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
        });

        const verificationCode = user.generateVerificationCode();
        await user.save();

        await sendVerificationCode(
            verificationMethod,
            verificationCode,
            name,
            email,
            phone,
            res
        );
    } catch (err) {
        next(err);
    }
});

async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res
) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);

      await sendEmail({
        email,
        subject: "Your verification code",
        message,
      });

      return res.status(201).json({
        success: true,
        message: `Verification code sent to ${name} successfully`,
      });
    }

    if (verificationMethod === "phone") {
      const client = getTwilioClient();
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!twilioPhoneNumber) {
        console.error("TWILIO_PHONE_NUMBER missing");
        return res.status(500).json({
          success: false,
          message: "Phone verification service not configured",
        });
      }

      const twiml = generateOtpTwiML(verificationCode);

      await client.calls.create({
        twiml,
        from: twilioPhoneNumber,
        to: phone,
      });

      return res.status(201).json({
        success: true,
        message: `OTP sent to ${name} via voice call successfully`,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid verification method",
    });
  } catch (error) {
    console.error("OTP VERIFICATION ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
}
function generateEmailTemplate(verificationCode) {
    return `
        <div style="font-family:Arial;max-width:600px;margin:auto;padding:20px">
            <h2>Verification Code</h2>
            <p>Your verification code is:</p>
            <h1>${verificationCode}</h1>
            <p>This code will expire in 10 minutes.</p>
        </div>
    `;
}

export const verifyOtp = catchAsyncError(async (req, res, next) => {
    const {email,phone,otp} = req.body;
    if(!otp || (!email && !phone)){
        return next(new ErrorHandler("Please provide all required fields",400))
    }
    function validatePhoneNumber(phone) {
        const e164Regex = /^\+[1-9]\d{1,14}$/;
        return e164Regex.test(phone);
    }
    if(!validatePhoneNumber(phone)){
        return next (new ErrorHandler("Invalid phone number.",400))
    }   
    try {
        const userAllentries = await User.find({
            $or:[
                {email,accountVerified:false},
                {phone,accountVerified:false}
            ]
        }).sort({createdAt:-1});
        if(userAllentries.length===0){
            return next(new ErrorHandler("User not found",404));
        }
        let user = userAllentries[0];
        if(userAllentries.length>1){
            await User.deleteMany({
                _id : {$ne : user._id},
                $or : [
                    {email,accountVerified : false},
                    {phone,accountVerified:false}
                ],
            });
        }
        if (user.verificationCode !== Number(otp)){
            return next (new ErrorHandler("Invalid verification code",400))
        }
        const currentTime = Date.now();
        const verificationCodeExpireTime = new Date(user.verificationCodeExpire).getTime();
        console.log("Current Time:", currentTime);
        console.log("Verification Code Expire Time:", verificationCodeExpireTime);
        if(currentTime > verificationCodeExpireTime){
            return next (new ErrorHandler("OTP expired",400))
        }

        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;
        await user.save({ validateModifiedOnly: true });

        sendToken(user,200,"Account Verified",res);


    } catch (error) {
        console.error("Error during OTP verification:", error);
        return next(new ErrorHandler("Server Error",500))
    }
})

export const login  = catchAsyncError(async (req,res,next)=>{
    const {email,phone,password} = req.body;
    if(!email || !password){
        return next (new ErrorHandler("Email and password are required",400))
    }
    const user= await User.findOne({email,accountVerified:true}).select("+password");
    if(!user){
        return next (new ErrorHandler("email not registered.",409))
    } 
    const ispasswordMatched = await user.comparePassword(password);
    if(!ispasswordMatched){
        return next (new ErrorHandler("Invalid email or password",403))
    }
    if(!ispasswordMatched){
        return next (new ErrorHandler("Invalid email or password",400))
    }
    sendToken(user,200,"Login Successful",res);
})

export const logout = catchAsyncError(async (req, res, next) => {
    //to token=="" or null
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success:true,
        message:"Logged out successfully", 
    });
});

export const getUser = catchAsyncError(async (req,res,next)=>{
    const user = req.user;
    const token = req.cookies.token;
    res.status(200).json({
        success:true,
        token : token,
        message:"User fetched successfully",
        user,
    })
})

export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
        accountVerified: true
    });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const resetToken = user.generateResetPasswordToken();
    await user.save({ validateModifiedOnly: true });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    console.log("RESET TOKEN : ",resetToken);
    const message = `Click to reset password:\n\n${resetPasswordUrl}\n\nIgnore if not requested.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Reset Password",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler("Email could not be sent", 500));
    }
});

export const resetPassword = catchAsyncError(async(req,res,next)=>{
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()},
    });     
    if(!user){
        return next(new ErrorHandler(" Password token is invalid or has been expired.",400));
    }
    if(req.body.password!== req.body.confirmPassword){
        return next(new ErrorHandler("Password and Confirm Password do not match",400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire =undefined;
    await user.save();
    sendToken(user,200,"Reset Password Successfully",res);
})