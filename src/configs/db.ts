import '../loadEnv.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

console.log('DATABASE_URL:', process.env.DATABASE_URL);
const connectionString = process.env.DATABASE_URL || '';
const client = new Client({ connectionString });
let isConnected = false;

export async function connectDb() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return drizzle(client);
}

export const dbPromise = connectDb(); 