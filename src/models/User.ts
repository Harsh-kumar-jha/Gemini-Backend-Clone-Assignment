import { pgTable, serial, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  mobile: varchar('mobile', { length: 15 }).notNull().unique(),
  password: text('password'), // nullable for OTP-only users
  name: varchar('name', { length: 100 }),
  tier: varchar('tier', { length: 20 }).default('Basic'),
  subscriptionId: varchar('subscription_id', { length: 64 }),
  subscriptionStatus: varchar('subscription_status', { length: 32 }),
  currentPeriodEnd: timestamp('current_period_end'),
  dailyPromptCount: integer('daily_prompt_count').default(0),
  lastPromptDate: timestamp('last_prompt_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
