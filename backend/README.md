# Backend API for Ubbabel-Mind

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
DB_HOST=postgres
DB_PORT=5432
DB_NAME=unbabel
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

4. Start PostgreSQL database

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```
PUT /api/auth/profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com"
}
```

### Answer Management

#### Submit Answer
```
POST /api/answers/submit
Content-Type: application/json

{
  "passageId": 20,
  "questionType": 1,
  "userId": 1,
  "answers": [
    {
      "questionId": 1,
      "userAnswer": ["A"]
    }
  ]
}
```

#### Submit Essay
```
POST /api/answers/submit
Content-Type: application/json

{
  "passageId": 20,
  "questionType": 4,
  "userId": 1,
  "essay": "Your essay content here..."
}
```

#### Get User Answers
```
GET /api/answers/:userId/:passageId/:questionType
```

#### Get User Essay
```
GET /api/answers/essay/:userId/:passageId/:questionType
```

#### Get User Results
```
GET /api/answers/results/:userId
```

#### Get User Results by Type
```
GET /api/answers/results/:userId/:questionType
```

#### Get Results with Correct Answers (Review)
```
GET /api/answers/review/:userId/:passageId/:questionType
```

### Health Check
```
GET /api/health
```

## Database Models

### Users
- `id` (SERIAL PRIMARY KEY)
- `first_name` (VARCHAR(255))
- `last_name` (VARCHAR(255))
- `email` (VARCHAR(255) UNIQUE)
- `password` (VARCHAR(255))
- `created_at` (TIMESTAMP)

### Answers
- Stores user answers for multiple choice questions
- Links to users, passages, and question types

### Essays
- Stores user essay submissions
- Links to users, passages, and question types

### Questions
- Stores question data for passages

### Results
- Stores user performance results
- Includes scores, correct answers count, and total questions

## Features

- PostgreSQL database integration with automatic table creation
- Password hashing with bcrypt
- JWT token authentication with 24-hour expiration
- User registration and login with profile management
- Answer submission for multiple choice questions and essays
- Score calculation and result tracking
- Review functionality with correct answers
- CORS enabled for frontend integration
- TypeScript implementation
- Docker support with development and production configurations

## Question Types

- `1`: Reading questions
- `2`: Listening questions
- `3`: Speaking questions
- `4`: Writing questions

## Docker Commands

```bash
# Development
npm run docker:dev

# Stop containers
npm run docker:stop

# Clean up volumes
npm run docker:clean

# View logs
npm run docker:logs
```

## Testing

Run the test script:
```bash
node test-auth.js
``` 