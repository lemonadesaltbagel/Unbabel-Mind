# Configuration Guide

This document explains how to properly configure the backend and frontend services for different environments.

## Environment Configuration

### Backend Configuration

The backend uses environment variables defined in `.env` file (copy from `backend/env.example`):

```bash
# For local development
DB_HOST=localhost

# For Docker development
DB_HOST=postgres
```

### Frontend Configuration

The frontend uses `NEXT_PUBLIC_API_URL` to determine the backend URL:

- **Local Development**: `http://localhost:3001/api`
- **Docker Development**: `http://backend:3001/api`
- **Production**: Set via Docker environment variables

## Docker Configuration

### Development (docker-compose.yml)
- Frontend: `NEXT_PUBLIC_API_URL=http://backend:3001/api`
- Backend: `DB_HOST=postgres`

### Production (docker-compose.prod.yml)
- Frontend: `NEXT_PUBLIC_API_URL=http://backend:3001/api`
- Backend: `DB_HOST=postgres`

## Local Development Setup

1. **Backend**: Create `backend/.env` from `backend/env.example` with `DB_HOST=localhost`
2. **Frontend**: Create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

## API Route Configuration

All frontend API routes now use the centralized `getBackendUrl()` function from `@/utils/config` to ensure consistent backend URL resolution across all environments.
