import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const otps = pgTable('otps', {
  id: serial('id').primaryKey(),
  mobile: varchar('mobile', { length: 15 }).notNull(),
  otp: varchar('otp', { length: 10 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // e.g., 'login', 'reset'
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
}); 