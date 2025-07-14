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

## Environment Variables
```
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/gemini_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

## API Documentation
See [api-docs/auth-docs.md](api-docs/auth-docs.md) for detailed authentication API usage.

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
- `docker-compose up -d` — Start DB & Redis
- `pnpm drizzle-kit generate` — Generate migrations
- `pnpm drizzle-kit push` — Apply migrations

---

## License
MIT
