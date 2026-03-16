# CriticLib

A monorepo for managing and reviewing books: NestJS API and Next.js web app.

## Structure

```
critic-lib/
├── apps/
│   ├── api/     # NestJS backend (REST API, Prisma, PostgreSQL)
│   └── web/     # Next.js frontend (React, MUI)
├── package.json
└── README.md
```

## Quick start

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Database

Run Postgres with Docker: `cd apps/api && docker-compose up -d`. Set `DATABASE_URL` in `apps/api/.env` (see `.env.example`). Or use your own PostgreSQL instance.

### 3. API (`apps/api`)

```bash
cd apps/api
cp .env.example .env
# Edit .env: DATABASE_URL (if not set above), CLOUDINARY_*
npx prisma migrate dev
npm run dev
```

API runs at **http://localhost:4200** (default).  
Swagger: **http://localhost:4200/docs**.

### 4. Web (`apps/web`)

```bash
cd apps/web
cp .env.example .env
# Set NEXT_PUBLIC_API_URL=http://localhost:4200/api
npm run dev
```

Web app runs at **http://localhost:3000** (default).

## Scripts (root)

| Script           | Description          |
| ---------------- | -------------------- |
| `npm run build`  | Build all apps (Nx)  |
| `npm run lint`   | Lint all apps        |
| `npm run format` | Format with Prettier |

## Apps

- **[apps/api](./apps/api/README.md)** – Backend API
- **[apps/web](./apps/web/README.md)** – Frontend
