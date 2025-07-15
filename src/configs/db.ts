import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { env } from './env.js';

const connectionString = env.DATABASE_URL;
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