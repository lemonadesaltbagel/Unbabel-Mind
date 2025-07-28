# Reading App Frontend

A modern React/Next.js frontend for an interactive reading comprehension platform.

## Features

- **Authentication System**: User registration, login, and profile management
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Reading**: Interactive reading sections with multiple-choice questions
- **Progress Tracking**: Track completion status and scores
- **Responsive Design**: Modern UI with dark theme
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Context API**: State management for authentication

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Authentication pages
│   ├── signup/
│   ├── reading/[id]/     # Dynamic reading pages
│   └── layout.tsx        # Root layout with AuthProvider
├── components/           # Reusable components
│   └── ProtectedRoute.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    └── api.ts          # API client
```

## API Integration

The frontend is configured to communicate with a Node.js backend running on `http://localhost:3001/api`. The API client includes:

- **Authentication**: Login, register, logout, get profile
- **Passages**: Get all passages, get by ID, submit answers
- **Progress**: Track user progress and scores

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
OPENAI_API_KEY=your_openai_api_key_here
```

### OpenAI API Key Setup

The application uses OpenAI's API for AI-powered features. You can set up your API key in two ways:

1. **Environment Variable** (Recommended for production):
   Add `OPENAI_API_KEY=your_actual_api_key` to your `.env.local` file

2. **Token File** (Easy setup for local development):
   Edit `openai_token.txt` in the frontend directory and replace `your_openai_api_key_here` with your actual OpenAI API key

The application will first check for the environment variable, then fall back to the token file if needed.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Requirements

The frontend expects a Node.js backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Passages
- `GET /api/passages` - Get all passages
- `GET /api/passages/:id` - Get passage by ID
- `POST /api/passages/:id/submit` - Submit answers
- `GET /api/passages/progress` - Get user progress

## Development

- **TypeScript**: All components and utilities are fully typed
- **ESLint**: Code linting with Next.js configuration
- **Tailwind**: Utility-first CSS framework
- **Hot Reload**: Fast development with Next.js hot reload

## Build

```bash
npm run build
npm start
```

## Key Features

### Authentication Flow
1. Users can register with email/password
2. Login with credentials
3. JWT tokens stored in localStorage
4. Automatic token validation on app load
5. Protected routes redirect to login

### Reading Experience
1. Dashboard shows available reading sections
2. Click to start a reading section
3. Answer multiple-choice questions
4. Submit answers for scoring
5. View results and return to dashboard

### State Management
- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Guards routes requiring authentication
- **API Client**: Centralized API communication with error handling
