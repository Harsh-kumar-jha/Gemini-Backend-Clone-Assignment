-- Drop the users table and all related objects
DROP TABLE IF EXISTS users CASCADE;

-- Drop the drizzle migration history table
DROP TABLE IF EXISTS __drizzle_migrations CASCADE;

-- Drop any other related tables that might have foreign keys to users
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chatrooms CASCADE;
DROP TABLE IF EXISTS otps CASCADE; 