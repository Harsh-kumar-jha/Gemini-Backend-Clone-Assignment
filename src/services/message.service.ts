import { publishToQueue } from '../utils/rabbitmq.util.js';
import { dbPromise } from '../configs/db.js';
import { messages } from '../models/Message.js';
import logger from '../utils/logger.util.js';
import { eq, asc } from 'drizzle-orm';

const QUEUE_NAME = 'gemini-message-queue';

export class MessageService {
  static async sendMessage(userId: number, chatroomId: number, content: string) {
    logger.info('[MessageService] Enqueuing user message for chatroom:', chatroomId, 'user:', userId);
    await publishToQueue(QUEUE_NAME, { userId, chatroomId, content });
  }

  static async storeMessage(chatroomId: number, sender: string, content: string) {
    logger.info('[MessageService] Storing message for chatroom:', chatroomId, 'sender:', sender);
    const db = await dbPromise;
    const [msg] = await db.insert(messages).values({ chatroomId, sender, content }).returning();
    return msg;
  }

  static async getMessages(chatroomId: number) {
    logger.info('[MessageService] Fetching messages for chatroom:', chatroomId);
    const db = await dbPromise;
    const msgs = await db.select().from(messages)
      .where(eq(messages.chatroomId, chatroomId))
      .orderBy(asc(messages.createdAt));
    return msgs;
  }
} 