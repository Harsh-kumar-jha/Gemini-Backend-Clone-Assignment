import { Request, Response } from "express";
import { users } from "../models/User.js";
import { eq } from "drizzle-orm";
import { dbPromise } from "../configs/db.js";
import { StripeService } from "../services/stripe.service.js";

export async function getMe(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const db = await dbPromise;
  const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      name: user.name,
      tier: user.tier,
    },
  });
}

export async function subscribePro(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Get user details from database to get email
    const db = await dbPromise;
    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Use email from database or generate one from mobile
    const userEmail = user.email || `${user.mobile}@temp.com`;
    const sessionUrl = await StripeService.createProCheckoutSession(
      userId,
      userEmail
    );
    return res.status(200).json({ success: true, url: sessionUrl });
  } catch (err: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to create Stripe session",
      });
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  try {
    const result = await StripeService.handleWebhook(req, sig);
    return res.status(200).json({ received: true, result });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Webhook Error" });
  }
}

export async function getSubscriptionStatus(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const status = await StripeService.getUserSubscriptionStatus(userId);
    return res.status(200).json({ success: true, ...status });
  } catch (err: any) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message || "Failed to get subscription status",
      });
  }
}
