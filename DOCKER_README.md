# Docker Setup for Unbabel Mind Project

This project uses Docker for consistent development and deployment environments with a full-stack setup including frontend, backend, and database services.

## Quick Start

### Development Environment
```bash
# Start all services in development mode
docker-compose up --build

# Stop all services
docker-compose down

# View logs for all services
docker-compose logs -f
```

### Production Environment
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up --build

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## Services Overview

### Frontend (Next.js)
- **Container:** `unbabel-frontend` (dev) / `unbabel-frontend-prod` (prod)
- **Port:** `3000` (host) → `3000` (container)
- **URL:** http://localhost:3000 (user access)
- **Internal Communication:** http://backend:3001/api
- **Environment:** Development with hot reload, production optimized

### Backend API (Node.js/Express)
- **Container:** `unbabel-backend` (dev) / `unbabel-backend-prod` (prod)
- **Port:** `3001` (host) → `3001` (container)
- **URL:** http://localhost:3001/api (user access)
- **Internal Communication:** postgres:5432 (database)
- **Environment:** Development with nodemon, production optimized

### PostgreSQL Database
- **Container:** `unbabel-db` (dev) / `unbabel-db-prod` (prod)
- **Port:** `5432` (host) → `5432` (container)
- **Database:** `unbabel`
- **User:** `postgres`
- **Password:** `password`

## Development Commands

### Using Docker Compose
```bash
# Start development environment
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# Stop services
docker-compose down

# Clean up volumes (removes database data)
docker-compose down -v

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f postgres

# Rebuild specific service
docker-compose build frontend
docker-compose build backend
```

## Environment Variables

### Development Environment
The following environment variables are automatically set in Docker:

**Backend:**
- `NODE_ENV=development`
- `PORT=3001`
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_NAME=unbabel`
- `DB_USER=postgres`
- `DB_PASSWORD=password`
- `JWT_SECRET=your-secret-key`

**Frontend:**
- `NODE_ENV=development`
- `NEXT_PUBLIC_API_URL=http://backend:3001/api`

### Production Environment
**Backend:**
- `NODE_ENV=production`
- `PORT=3001`
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_NAME=unbabel`
- `DB_USER=postgres`
- `DB_PASSWORD=password`
- `JWT_SECRET=your-secret-key`

**Frontend:**
- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL=http://backend:3001`

## Database Access

### From Host Machine
```bash
# Connect to PostgreSQL
psql -h localhost -p 5432 -U postgres -d unbabel
```

### From Inside Backend Container
```bash
# Access backend container
docker exec -it unbabel-backend sh

# Connect to database
psql -h postgres -p 5432 -U postgres -d unbabel
```

### From Inside Frontend Container
```bash
# Access frontend container
docker exec -it unbabel-frontend sh
```

## Troubleshooting

### Reset Database
```bash
# Remove database volume and restart
docker-compose down -v
docker-compose up --build
```

### Rebuild Services
```bash
# Rebuild specific service
docker-compose build frontend
docker-compose build backend

# Rebuild all services
docker-compose build --no-cache
docker-compose up
```

### Check Container Status
```bash
# List running containers
docker ps

# Check container logs
docker logs unbabel-frontend
docker logs unbabel-backend
docker logs unbabel-db
```

### Common Issues

**Port conflicts:**
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :3001
lsof -i :5432
```

**Permission issues:**
```bash
# Fix node_modules permissions
docker-compose down
sudo rm -rf backend/node_modules frontend/node_modules
docker-compose up --build
```

## Production Deployment

### Using Production Docker Compose
```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up --build -d

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Manual Production Build
```bash
# Build production images
docker build -f backend/Dockerfile -t unbabel-backend:prod ./backend
docker build -f frontend/Dockerfile.prod -t unbabel-frontend:prod ./frontend
```

## Network Configuration

All services are connected via the `unbabel-network` bridge network, allowing them to communicate using service names:
- Frontend → Backend: `http://backend:3001/api`
- Backend → Database: `postgres:5432`

## Volume Mounts

### Development
- **Frontend:** `./frontend:/app` (source code), `/app/node_modules` (dependencies), `/app/.next` (build cache)
- **Backend:** `./backend:/app` (source code), `/app/node_modules` (dependencies)
- **Database:** `postgres_data:/var/lib/postgresql/data` (persistent data)

### Production
- **Database:** `postgres_data:/var/lib/postgresql/data` (persistent data)
- Frontend and backend use built images without source code mounts

## Technology Stack

- **Frontend:** Next.js 15.3.5, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js 18, Express 5, TypeScript, PostgreSQL
- **Database:** PostgreSQL 17
- **Containerization:** Docker, Docker Compose 