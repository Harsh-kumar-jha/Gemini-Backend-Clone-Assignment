import Stripe from "stripe";
import { env } from "../configs/env.js";
import { dbPromise } from "../configs/db.js";
import { users } from "../models/User.js";
import { eq } from "drizzle-orm";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export class StripeService {
  static async createProCheckoutSession(
    userId: number,
    userEmail: string
  ): Promise<string> {
    // Create a Stripe Checkout session for a Pro subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: userEmail,
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: String(userId),
      },
      success_url: env.STRIPE_SUCCESS_URL || "http://localhost:3000/success",
      cancel_url: env.STRIPE_CANCEL_URL || "http://localhost:3000/cancel",
    });
    return session.url!;
  }

  static async handleWebhook(request: any, sig: string): Promise<any> {
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;
    try {
      // For raw body from express.raw()
      const body = request.body || request.rawBody;
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle subscription events
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      if (userId) {
        const db = await dbPromise;
        const status = subscription.status;
        const currentPeriodEnd = new Date(
          (subscription as any).current_period_end * 1000 ||
            (subscription as any).currentPeriodEnd * 1000
        );
        await db
          .update(users)
          .set({
            subscriptionId: subscription.id,
            subscriptionStatus: status,
            currentPeriodEnd,
            tier: status === "active" ? "Pro" : "Basic",
          })
          .where(eq(users.id, Number(userId)));
      }
    }
    // Optionally handle invoice.payment_failed, etc.
    return { type: event.type };
  }

  static async getUserSubscriptionStatus(
    userId: number
  ): Promise<{ tier: string; status: string; currentPeriodEnd: Date | null }> {
    const db = await dbPromise;
    const user = (await db.select().from(users).where(eq(users.id, userId)))[0];
    if (!user) {
      return { tier: "Basic", status: "inactive", currentPeriodEnd: null };
    }
    return {
      tier: user.tier || "Basic",
      status: user.subscriptionStatus || "inactive",
      currentPeriodEnd: user.currentPeriodEnd || null,
    };
  }
}
