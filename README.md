# Hackathon Project

Full-stack application with Next.js frontend and Node.js backend using PostgreSQL, fully containerized with Docker.

## Architecture

```
Hackathon/
├── frontend/              # Next.js application (port 3000)
├── backend/               # Node.js API server (port 3001)
├── shared/                # Shared types/utilities
├── docker-compose.yml     # Development Docker setup
├── docker-compose.prod.yml # Production Docker setup
└── package.json           # Root scripts
```

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Development Setup

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Production Setup

```bash
docker-compose -f docker-compose.prod.yml up --build
```

## Development Features

- **Hot Reloading**: Both frontend and backend support live development
- **Volume Mounting**: Source code changes are reflected immediately
- **Network Isolation**: All services communicate through Docker network
- **Database Persistence**: PostgreSQL data is persisted across container restarts

## Available Scripts

### Docker Commands
- `docker-compose up` - Start all development services
- `docker-compose up -d` - Start services in background
- `docker-compose down` - Stop all services
- `docker-compose logs -f` - View live logs
- `docker-compose -f docker-compose.prod.yml up --build` - Start production services

### Individual Services
- `docker-compose up frontend` - Start only frontend
- `docker-compose up backend` - Start only backend
- `docker-compose up postgres` - Start only database

## Environment Variables

The Docker setup includes all necessary environment variables. For custom configuration:

- **Development**: Modify `docker-compose.yml`
- **Production**: Modify `docker-compose.prod.yml`

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL 17
- **Containerization:** Docker & Docker Compose
- **Development:** Hot reloading, volume mounting

## Documentation

For detailed Docker setup instructions, see [DOCKER_SETUP.md](./DOCKER_SETUP.md). 