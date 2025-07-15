import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../utils/redis.util.js';

const BASIC_DAILY_LIMIT = 5; // Limit for Basic users
const WINDOW_SECONDS = 24 * 60 * 60;

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const user = req.user;
  if (!user) return next();
  if (user.tier !== 'Basic') {
    // Pro users have no daily limit
    return next();
  }
  const key = `rate:${user.id}:${new Date().toISOString().slice(0, 10)}`; // rate:userId:YYYY-MM-DD
  let countStr = await redisClient.get(key);
  let count = countStr ? parseInt(countStr, 10) : 0;
  if (count === 0) {
    await redisClient.setEx(key, WINDOW_SECONDS, '1');
    return next();
  }
  if (count >= BASIC_DAILY_LIMIT) {
    return res.status(429).json({ success: false, message: 'Daily prompt limit reached for Basic users. Upgrade to Pro for unlimited access.' });
  }
  await redisClient.set(key, (count + 1).toString());
  next();
} 