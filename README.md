# Gemini Backend Assignment

## Overview

A Node.js backend using Express, TypeScript, Drizzle ORM, PostgreSQL, Redis, and Docker. Features OTP-based authentication, JWT, rate limiting, and more.

## Features

- OTP-based login (mocked OTP in API response)
- JWT authentication
- Rate limiting for Basic users
- PostgreSQL (Drizzle ORM)
- Redis for caching/rate limiting
- Docker Compose for local dev

## Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose

## Setup

1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd gemini-backend-assignment
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Configure environment:**

   - Copy `.env.sample` to `.env` and fill in values (see below).

4. **Start PostgreSQL & Redis (Docker):**

   ```sh
   docker-compose up -d
   ```

5. **Run migrations:**

   ```sh
   pnpm drizzle-kit generate
   pnpm drizzle-kit push
   ```

6. **Start the dev server:**

   ```sh
   pnpm dev
   ```

7. **Start the Gemini message worker (in a separate terminal):**
   ```sh
   pnpm tsx src/workers/geminiMessage.worker.ts
   ```
   This worker processes chat messages asynchronously via RabbitMQ and the Gemini API. It must be running for chat responses to work.

## Environment Variables

```
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/gemini_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
GEMINI_API_KEY=your-google-gemini-api-key
RABBITMQ_URL=amqp://localhost:5672
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PRICE_ID=price_your_stripe_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_SUCCESS_URL=http://localhost:3000/success
STRIPE_CANCEL_URL=http://localhost:3000/cancel
```

## API Documentation

- See [api-docs/auth-docs.md](api-docs/auth-docs.md) for detailed authentication API usage.
- See [api-docs/chat-service-docs.md](api-docs/chat-service.docs.md) for detailed Chat room Service API usage.
- See [api-docs/subscription-payments.docs.md](api-docs/subscription-payments.docs.md) for Subscription & Payments API usage.

## Project Structure

```
.
├── src/
│   ├── app.ts              # Express app entry point
│   ├── configs/            # Database and config files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares (auth, error, rate limit)
│   ├── models/             # Drizzle ORM models (User, OTP)
│   ├── routes/             # Express route definitions
│   ├── services/           # Business logic (OTP, etc.)
│   ├── types/              # TypeScript type extensions
│   ├── utils/              # Utility modules (JWT, Redis, logger)
│   └── workers/            # (Optional) Background jobs
├── api-docs/               # API documentation markdown files
├── drizzle.config.json     # Drizzle ORM config
├── docker-compose.yml      # Docker Compose for Postgres & Redis
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript config
├── .env                    # Environment variables
└── README.md               # Project overview and instructions
```

## Useful Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Build TypeScript
- `pnpm start` — Run built app
- `pnpm tsx src/workers/geminiMessage.worker.ts` — Run Gemini message worker (async chat)
- `docker-compose up -d` — Start DB, Redis, RabbitMQ
- `pnpm drizzle-kit generate` — Generate migrations
- `pnpm drizzle-kit push` — Apply migrations

---

## Production: Running with PM2

For production, use [PM2](https://pm2.keymetrics.io/) to run both the main app and the Gemini worker simultaneously and reliably.

### 1. Install PM2 globally (if not already):

```sh
pnpm add -g pm2
```

### 2. Build your app:

```sh
pnpm build
```

### 3. Start both processes with PM2:

```sh
pm2 start dist/app.js --name app
pm2 start src/workers/geminiMessage.worker.ts --interpreter pnpm --name gemini-worker
```

- If you use TypeScript directly in production, use `--interpreter pnpm` with `tsx` as above.
- If you run compiled JS, use the built JS files (e.g., `dist/workers/geminiMessage.worker.js`).

### 4. Save the process list and enable startup on boot:

```sh
pm2 save
pm2 startup
```

### 5. Monitor logs:

```sh
pm2 logs
```

This ensures both your main app and the Gemini worker run together and restart automatically if they crash or the server reboots.

---

## Managing PM2 Processes

Here are some useful commands for managing your PM2 processes in production:

| Action               | Command                   |
| -------------------- | ------------------------- |
| Stop one process     | `pm2 stop <name or id>`   |
| Stop all processes   | `pm2 stop all`            |
| Delete one process   | `pm2 delete <name or id>` |
| Delete all processes | `pm2 delete all`          |
| List processes       | `pm2 list`                |

**Examples:**

- Stop just the Gemini worker:
  ```sh
  pm2 stop gemini-worker
  ```
- Stop all PM2 processes:
  ```sh
  pm2 stop all
  ```
- Delete (remove) the Gemini worker from PM2:
  ```sh
  pm2 delete gemini-worker
  ```
- List all running PM2 processes:

  ```sh
  pm2 list
  ```

- `stop` will stop the process but keep it in the PM2 list (so you can restart it later).
- `delete` will stop and remove it from the list.

---

## License

MIT
