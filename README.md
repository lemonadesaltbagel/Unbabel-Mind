# Hackathon Project

Full-stack application with Next.js frontend and Node.js backend using PostgreSQL.

## Architecture

```
Hackathon/
├── frontend/          # Next.js application (port 3000)
├── backend/           # Node.js API server (port 3001)
├── shared/            # Shared types/utilities
├── docker-compose.yml # PostgreSQL database
└── package.json       # Root scripts
```

```
Hackathon/
├── frontend/          # Next.js app (TypeScript, Tailwind, ESLint)
├── backend/           # Node.js (Express, TypeScript, PostgreSQL)
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   └── api.ts
│   │   └── config/
│   │       └── database.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
├── shared/            # (empty, for future shared code)
├── docker-compose.yml # PostgreSQL service
├── package.json       # Root scripts for dev/build/db
└── README.md
```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start PostgreSQL database:**
   ```bash
   npm run db:up
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both frontend and backend
- `npm run db:up` - Start PostgreSQL database
- `npm run db:down` - Stop PostgreSQL database

## Environment Variables

Copy `backend/env.example` to `backend/.env` and configure your database settings.

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Development:** Docker Compose 