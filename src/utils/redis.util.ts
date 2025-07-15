import { createClient } from 'redis';
import { env } from '../configs/env.js';

const redisUrl = env.REDIS_URL;

export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
} 