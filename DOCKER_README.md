# Docker Setup for Hackathon Project

This project now uses Docker for consistent development and deployment environments.

## Quick Start

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Stop all services:**
   ```bash
   docker-compose down
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## Services

### PostgreSQL Database
- **Container:** `hackathon-db`
- **Port:** `5432` (host) → `5432` (container)
- **Database:** `hackathon`
- **User:** `postgres`
- **Password:** `password`

### Backend API
- **Container:** `hackathon-backend`
- **Port:** `3001` (host) → `3001` (container)
- **Environment:** Development with hot reload

## Development Commands

### Using Docker Compose
```bash
# Start development environment
docker-compose up --build

# Stop services
docker-compose down

# Clean up volumes (removes database data)
docker-compose down -v

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Using npm scripts (from backend directory)
```bash
# Start with Docker
npm run docker:dev

# Stop Docker services
npm run docker:stop

# Clean Docker volumes
npm run docker:clean

# View logs
npm run docker:logs
```

## Environment Variables

The following environment variables are automatically set in Docker:

- `DB_HOST=postgres` (Docker service name)
- `DB_PORT=5432`
- `DB_NAME=hackathon`
- `DB_USER=postgres`
- `DB_PASSWORD=password`
- `JWT_SECRET=your-secret-key`
- `PORT=3001`

## Database Access

### From Host Machine
```bash
# Connect to PostgreSQL
psql -h localhost -p 5432 -U postgres -d hackathon
```

### From Inside Backend Container
```bash
# Access backend container
docker exec -it hackathon-backend sh

# Connect to database
psql -h postgres -p 5432 -U postgres -d hackathon
```

## Troubleshooting

### Reset Database
```bash
# Remove database volume and restart
docker-compose down -v
docker-compose up --build
```

### Rebuild Backend
```bash
# Rebuild backend container
docker-compose build backend
docker-compose up
```

### Check Container Status
```bash
# List running containers
docker ps

# Check container logs
docker logs hackathon-backend
docker logs hackathon-db
```

## Production

For production deployment, use the production Dockerfile:

```bash
# Build production image
docker build -f backend/Dockerfile -t hackathon-backend:prod ./backend
```

## Network

All services are connected via the `hackathon-network` bridge network, allowing them to communicate using service names (e.g., `postgres` for the database host). 