import { sendOtp, verifyOtp } from "../services/otp.service.js";
import { signJwt } from "../utils/jwt.util.js";
import { AuthService } from "../services/auth.service.js";
import { Request, Response } from "express";

export async function signup(req: Request, res: Response) {
  const { mobile, email, name, password } = req.body;
  if (!mobile) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number is required" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  // Check if user exists by mobile or email
  const existingByMobile = await AuthService.findUserByMobile(mobile);
  if (existingByMobile) {
    return res
      .status(409)
      .json({
        success: false,
        message: "User with this mobile number already exists",
      });
  }

  const existingByEmail = await AuthService.findUserByEmail(email);
  if (existingByEmail) {
    return res
      .status(409)
      .json({ success: false, message: "User with this email already exists" });
  }

  await AuthService.createUser({ mobile, email, name, password });
  return res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
}

export async function sendOtpController(req: Request, res: Response) {
  const { mobile, type = "login" } = req.body;
  if (!mobile) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number is required" });
  }
  const otp = await sendOtp(mobile, type);
  return res
    .status(200)
    .json({ success: true, otp, message: "OTP sent (mocked)" });
}

export async function verifyOtpController(req: Request, res: Response) {
  const { mobile, otp, type = "login" } = req.body;
  if (!mobile || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile and OTP are required" });
  }
  const valid = await verifyOtp(mobile, type, otp);
  if (!valid) {
    return res.status(401).json({ success: false, message: "Invalid OTP" });
  }
  // Find or create user
  let user = await AuthService.findUserByMobile(mobile);
  if (!user) {
    user = await AuthService.createUser({ mobile });
  }
  const token = signJwt({
    id: user.id,
    mobile: user.mobile,
    email: user.email,
    tier: user.tier,
  });
  return res
    .status(200)
    .json({
      success: true,
      token,
      user: {
        id: user.id,
        mobile: user.mobile,
        email: user.email,
        tier: user.tier,
      },
    });
}

export async function forgotPasswordController(req: Request, res: Response) {
  const { mobile } = req.body;
  if (!mobile) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number is required" });
  }
  // Send OTP for password reset
  const otp = await sendOtp(mobile, "reset");
  return res
    .status(200)
    .json({
      success: true,
      otp,
      message: "OTP for password reset sent (mocked)",
    });
}

export async function changePasswordController(req: Request, res: Response) {
  const { password } = req.body;
  // @ts-ignore
  const userId = req.user?.id;
  if (!userId || !password) {
    return res
      .status(400)
      .json({ success: false, message: "User and password required" });
  }
  await AuthService.changePassword(userId, password);
  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
}
