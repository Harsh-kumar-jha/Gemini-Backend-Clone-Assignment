import { Request, Response } from 'express';
import { users } from '../models/User.js';
import { eq } from 'drizzle-orm';
import { dbPromise } from '../configs/db.js';

export async function getMe(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const db = await dbPromise;
  const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.status(200).json({ success: true, user: { id: user.id, mobile: user.mobile, name: user.name, tier: user.tier } });
} 