# Backend Authentication API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp env.example .env
```

3. Update `.env` with your PostgreSQL credentials:
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hackathon
DB_USER=postgres
DB_PASSWORD=your-password
JWT_SECRET=your-super-secret-jwt-key
```

4. Start PostgreSQL database

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Health Check
```
GET /api/health
```

## Features

- PostgreSQL database integration
- Password hashing with bcrypt
- JWT token authentication
- User registration and login
- Automatic database table creation
- CORS enabled for frontend integration

## Testing

Run the test script:
```bash
node test-auth.js
``` 