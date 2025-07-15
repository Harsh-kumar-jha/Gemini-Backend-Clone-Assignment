import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const chatrooms = pgTable('chatrooms', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 