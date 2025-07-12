# Docker Setup Guide

This project is now fully containerized with Docker. The setup includes frontend, backend, and database services.

## Architecture

- **Frontend**: Next.js application running on port 3000
- **Backend**: Node.js/Express API running on port 3001
- **Database**: PostgreSQL running on port 5432

## Development Setup

### Prerequisites
- Docker
- Docker Compose

### Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd Hackathon
   ```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Development Features

- **Hot Reloading**: Both frontend and backend support hot reloading
- **Volume Mounting**: Source code is mounted for live development
- **Network Isolation**: All services communicate through Docker network

## Production Setup

### Build and Deploy

1. **Build production images:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

2. **Or build individual services:**
   ```bash
   # Frontend
   docker build -f frontend/Dockerfile.prod -t hackathon-frontend:prod ./frontend
   
   # Backend
   docker build -f backend/Dockerfile -t hackathon-backend:prod ./backend
   ```

## Docker Files Structure

```
├── docker-compose.yml          # Development setup
├── docker-compose.prod.yml     # Production setup
├── frontend/
│   ├── Dockerfile             # Development frontend
│   ├── Dockerfile.dev         # Development frontend (same as Dockerfile)
│   ├── Dockerfile.prod        # Production frontend
│   └── .dockerignore          # Exclude files from build
└── backend/
    ├── Dockerfile             # Production backend
    └── Dockerfile.dev         # Development backend
```

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001)

### Backend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key

## Useful Commands

### Development
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Production
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up --build

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

### Individual Services
```bash
# Start only frontend
docker-compose up frontend

# Start only backend
docker-compose up backend

# Start only database
docker-compose up postgres
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, and 5432 are available
2. **Build failures**: Clear Docker cache with `docker system prune -a`
3. **Database connection**: Wait for PostgreSQL to fully start before starting backend
4. **Hot reload not working**: Check volume mounts in docker-compose.yml

### Debug Commands
```bash
# Check running containers
docker ps

# View container logs
docker logs hackathon-frontend
docker logs hackathon-backend
docker logs hackathon-db

# Access container shell
docker exec -it hackathon-frontend sh
docker exec -it hackathon-backend sh
```

## Performance Optimizations

### Development
- Volume mounting for hot reloading
- Shared node_modules volumes
- Development-specific Dockerfiles

### Production
- Multi-stage builds for smaller images
- Standalone Next.js output
- Optimized layer caching
- Production-specific configurations

## Security Notes

- Change default passwords in production
- Use environment files for secrets
- Consider using Docker secrets for sensitive data
- Regularly update base images 