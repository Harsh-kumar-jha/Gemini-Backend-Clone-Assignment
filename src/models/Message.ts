import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatroomId: integer('chatroom_id').notNull(),
  sender: varchar('sender', { length: 20 }).notNull(), // 'user' or 'gemini'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}); 