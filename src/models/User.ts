import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  mobile: varchar('mobile', { length: 15 }).notNull().unique(),
  password: text('password'), // nullable for OTP-only users
  name: varchar('name', { length: 100 }),
  tier: varchar('tier', { length: 20 }).default('Basic'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
