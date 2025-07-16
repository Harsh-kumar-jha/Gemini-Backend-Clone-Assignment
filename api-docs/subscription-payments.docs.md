# Subscription & Payments API Documentation

**Note**: Subscription endpoints are available at root level as per requirements specification.

---

## 1. Start Pro Subscription

- **POST** `/subscribe/pro`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Initiates a Stripe Checkout session for the Pro subscription tier.
- **Request Body:** _None_
- **Response:**
  ```json
  { "success": true, "url": "https://checkout.stripe.com/pay/cs_test_..." }
  ```
- **Notes:** Redirect the user to the returned URL to complete payment.

---

## 2. Stripe Webhook

- **POST** `/webhook/stripe`
- **Auth Required:** No (Stripe only)
- **Description:** Handles Stripe webhook events (subscription created, updated, canceled, payment failed, etc.).
- **Request Body:** Stripe event payload (sent by Stripe)
- **Response:**
  ```json
  { "received": true, "result": { "type": "customer.subscription.updated" } }
  ```
- **Notes:** This endpoint should be set as a webhook in your Stripe dashboard. It updates user subscription status in your database.

---

## 3. Get Subscription Status

- **GET** `/subscription/status`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Returns the user's current subscription tier, status, and period end.
- **Response:**
  ```json
  {
    "success": true,
    "tier": "Pro",
    "status": "active",
    "currentPeriodEnd": "2024-07-31T23:59:59.000Z"
  }
  ```

---

## 4. Usage Limits

- **Basic (Free) Tier:** Limited to 5 prompts per day.
- **Pro (Paid) Tier:** Unlimited prompts per day.
- **Response on limit exceeded (Basic):**
  ```json
  {
    "success": false,
    "message": "Daily prompt limit reached for Basic users. Upgrade to Pro for unlimited access."
  }
  ```

---
