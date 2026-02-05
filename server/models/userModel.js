import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },

  phone: {
    type: String,
  },

  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },

  accountVerified: {
    type: Boolean,
    default: false,
  },

  verificationCode: Number,
  verificationCodeExpire: Date,

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  const ans =  await bcrypt.compare(enteredPassword, this.password);
  // console.log("Password match result:", ans);
  return ans;
};
userSchema.methods.generateVerificationCode = function(){
  function generateFiveDigitNumber(){
    const firstDigit = Math.floor(Math.random()*9)+1;
    const remainingDigits = Math.floor(Math.random()*10000).toString().padStart(4,"0");
    return parseInt(firstDigit+remainingDigits);
  }
  const verificationCode = generateFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000);
  return verificationCode;
}
userSchema.methods.generateToken = async function () {
  return await jwt.sign(
    { id: this._id }, 
    process.env.JWT_SECRET_KEY, 
    {expiresIn: process.env.JWT_EXPIRE,
  });
}
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
  this.resetPasswordExpire = Date.now()+15*60*1000;//15min to msec liike 1min = 1*60*1000
  return resetToken; 
}
export const User = mongoose.model("User", userSchema);