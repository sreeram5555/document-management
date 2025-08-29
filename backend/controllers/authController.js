import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {transporter} from "../config/mailer.js";
import { sendEmail } from "../config/mailer.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


const setAuthCookie = (res, token) => {

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,       
  sameSite: "none"   
});
};

const getTokenFromReq = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
};

// ================= SIGNUP (with OTP email) =================


export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 min

    const user = await User.create({ username, email, password, otp, otpExpires });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<h2>Hello ${username}</h2><p>Your OTP: <b>${otp}</b></p>`,
    });

    res.status(201).json({ message: "OTP sent to email. Please verify." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY EMAIL =================

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ _id: user._id, username: user.username, email: user.email, token });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(401).json({ message: "Verify your email first" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });

    const token = generateToken(user._id);
    res.json({ _id: user._id, username: user.username, email: user.email, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");
//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
//     user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;


//     const forgotpasswordlink = {
//        from: process.env.SENDER_EMAIL,
//       to: user.email,
//         subject: "Password Reset",
//       html: `<p>You requested a password reset.</p>
//              <p>Click the link below:</p>
//              <a href="${resetUrl}">${resetUrl}</a>`,
//     }

//    await transporter.sendMail(forgotpasswordlink);

//     // await transporter.sendMail({
//     //   from: process.env.SENDER_EMAIL,
//     //   to: user.email,
//     //   subject: "Password Reset",
//     //   html: `<p>You requested a password reset.</p>
//     //          <p>Click the link below:</p>
//     //          <a href="${resetUrl}">${resetUrl}</a>`,
//     // });

//     res.status(200).json({ message: "Password reset email sent" });
//   } catch (error) {
//   console.error("❌ Register error:", error); // log full error object
//   res.status(500).json({
//     message: error.message || "Server error",
//     stack: process.env.NODE_ENV === "development" ? error.stack : undefined
//   });
// }
// };

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
  console.error("❌ Register error:", error); // log full error object
  res.status(500).json({
    message: error.message || "Server error",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
}
};


// ================= FORGOT PASSWORD =================


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `https://document-management-b6lp.onrender.com/resetpassword/${resetToken}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset",
      html: `<p>You requested a password reset.</p>
             <p>Click the link below:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("❌ Forgot Password error:", error);
    res.status(500).json({
      message: error.message || "Server error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};


// export const sendResetOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     const otp = generateOTP();
//     user.resetotp = otp;
//     user.resetotpexpireat = Date.now() + 10 * 60 * 1000;
//     await user.save();


//     const resendotpreset = {
//           from:process.env.SENDER_EMAIL,
//       to: email,
//       subject: "Reset your password",
//       html: `<p>Your reset OTP: <b>${otp}</b></p>`,
//     }
   

//     await transporter.sendMail(resendotpreset);



//     res.json({ success: true, message: "Reset OTP sent" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

//reset password
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newpassword } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     if (user.resetotp !== otp) return res.json({ success: false, message: "Invalid OTP" });
//     if (Date.now() > user.resetotpexpireat) return res.json({ success: false, message: "OTP expired" });

//     user.password = await bcrypt.hash(newpassword, 10);
//     user.resetotp = "";
//     user.resetotpexpireat = 0;
//     await user.save();



//     const resetpassword1 = {
//       from:process.env.SENDER_EMAIL,
//       to: email,
//       subject: "Password changed",
//       html: `<p>Your password has been updated successfully.</p>`,
//     }
   

//     await transporter.sendMail(resetpassword1)

//     res.json({ success: true, message: "Password reset successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const resendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });
//     if (user.isaccountverified) return res.json({ success: false, message: "Already verified" });

//     const otp = generateOTP();
//     user.verifyotp = otp;
//     user.verifyotpexpireat = Date.now() + 10 * 60 * 1000;
//     await user.save();


//     const resendotp = {
//        from:process.env.SENDER_EMAIL,
//       to: email,
//       subject: "Your verification OTP",
//       html: `<p>Your OTP: <b>${otp}</b></p>`,
//     }



// await transporter.sendMail(resendotp);

//     res.json({ success: true, message: "OTP re-sent" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };