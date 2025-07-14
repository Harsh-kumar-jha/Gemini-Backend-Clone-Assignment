import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../utils/redis.util.js';

const DAILY_LIMIT = 100;
const WINDOW_SECONDS = 24 * 60 * 60;

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const user = req.user;
  if (!user || user.tier !== 'Basic') {
    return next();
  }
  const key = `rate:${user.id}:${new Date().toISOString().slice(0, 10)}`; // rate:userId:YYYY-MM-DD
  let countStr = await redisClient.get(key);
  let count = countStr ? parseInt(countStr, 10) : 0;
  if (count === 0) {
    await redisClient.setEx(key, WINDOW_SECONDS, '1');
    return next();
  }
  if (count >= DAILY_LIMIT) {
    return res.status(429).json({ success: false, message: 'Daily request limit reached' });
  }
  await redisClient.set(key, (count + 1).toString());
  next();
} 