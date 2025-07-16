import { dbPromise } from "../configs/db.js";
import { users } from "../models/User.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.util.js";

export class AuthService {
  static async findUserByMobile(mobile: string) {
    logger.info("[AuthService] Looking up user by mobile:", mobile);
    const db = await dbPromise;
    const user = (
      await db.select().from(users).where(eq(users.mobile, mobile))
    )[0];
    return user;
  }

  static async findUserByEmail(email: string) {
    logger.info("[AuthService] Looking up user by email:", email);
    const db = await dbPromise;
    const user = (
      await db.select().from(users).where(eq(users.email, email))
    )[0];
    return user;
  }

  static async createUser({
    mobile,
    email,
    name,
    password,
  }: {
    mobile: string;
    email?: string;
    name?: string;
    password?: string;
  }) {
    logger.info("[AuthService] Creating user:", mobile, email);
    const db = await dbPromise;
    let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const [user] = await db
      .insert(users)
      .values({ mobile, email, name, password: hashedPassword })
      .returning();
    return user;
  }

  static async changePassword(userId: number, password: string) {
    logger.info("[AuthService] Changing password for user:", userId);
    const db = await dbPromise;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
    return true;
  }
}
