import { redisClient } from '../utils/redis.util.js';

const OTP_TTL_SECONDS = 300; // 5 minutes

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(mobile: string, type: string) {
  const otp = generateOtp();
  const key = `otp:${type}:${mobile}`;
  await redisClient.setEx(key, OTP_TTL_SECONDS, otp);
  return otp; 
}

export async function verifyOtp(mobile: string, type: string, otp: string) {
  const key = `otp:${type}:${mobile}`;
  const storedOtp = await redisClient.get(key);
  if (storedOtp && storedOtp === otp) {
    await redisClient.del(key);
    return true;
  }
  return false;
} 