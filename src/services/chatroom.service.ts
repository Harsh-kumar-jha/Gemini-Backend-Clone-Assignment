import { dbPromise } from '../configs/db.js';
import { chatrooms } from '../models/Chatroom.js';
import { eq, and } from 'drizzle-orm';
import { redisClient } from '../utils/redis.util.js';
import logger from '../utils/logger.util.js';

export class ChatroomService {
  static async create(userId: number, name: string) {
    logger.info('[ChatroomService] Creating chatroom for user:', userId, 'name:', name);
    const db = await dbPromise;
    const [chatroom] = await db.insert(chatrooms).values({ userId, name }).returning();
    // Invalidate cache for this user's chatrooms
    await redisClient.del(ChatroomService._cacheKey(userId));
    return chatroom;
  }

  static async list(userId: number) {
    const cacheKey = ChatroomService._cacheKey(userId);
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info('[ChatroomService] Returning chatroom list from cache for user:', userId);
      return JSON.parse(cached);
    }
    logger.info('[ChatroomService] Querying chatroom list from DB for user:', userId);
    const db = await dbPromise;
    const rooms = await db.select().from(chatrooms).where(eq(chatrooms.userId, userId));
    await redisClient.setEx(cacheKey, 60, JSON.stringify(rooms)); // cache for 60s
    return rooms;
  }

  static async getById(userId: number, chatroomId: number) {
    logger.info('[ChatroomService] Getting chatroom detail for user:', userId, 'chatroom:', chatroomId);
    const db = await dbPromise;
    const [room] = await db.select().from(chatrooms).where(and(eq(chatrooms.id, chatroomId), eq(chatrooms.userId, userId)));
    return room;
  }

  private static _cacheKey(userId: number) {
    return `chatrooms:${userId}`;
  }
} 