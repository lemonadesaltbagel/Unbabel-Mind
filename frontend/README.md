# IELTS Practice App Frontend - Developer Documentation

A modern React/Next.js frontend for an interactive IELTS practice platform with comprehensive skill development.

## Technical Overview

This frontend application is built with Next.js 15 using the App Router pattern, providing a comprehensive IELTS practice platform with four core skills (Reading, Listening, Speaking, Writing) plus AI-powered quiz functionality.

## Architecture

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with utility-first approach
- **State Management**: React Context API for authentication
- **API Integration**: Custom API client with OpenAI integration
- **Build Tool**: Next.js built-in bundler

## Core Features Implementation

### Authentication System
- JWT-based authentication with localStorage persistence
- Protected route wrapper component
- Automatic token validation and refresh
- User profile management with update capabilities

### Skill Modules
Each IELTS skill is implemented as a separate module with consistent patterns:

#### Reading Module
- **File Structure**: `app/reading/[id]/[type]/page.tsx`
- **Components**: `ReadingPassage`, `QuestionList`, `ReadingControls`
- **Utilities**: `utils/reading.ts` for data management
- **Features**: Text highlighting, context menu, multiple question types

#### Listening Module
- **File Structure**: `app/listening/[id]/[type]/page.tsx`
- **Components**: `ListeningTranscript`, `QuestionList`, `ReadingControls`
- **Utilities**: `utils/listening.ts` for audio management
- **Features**: Transcript display, audio controls

#### Speaking Module
- **File Structure**: `app/speaking/[id]/[type]/page.tsx`
- **Components**: `SpeakingPrompt`, `QuestionList`, `ReadingControls`
- **Utilities**: `utils/speaking.ts` for recording management
- **Features**: Audio recording, prompt display

#### Writing Module
- **File Structure**: `app/writing/[id]/[type]/page.tsx`
- **Components**: `WritingPrompt`, `EssayEditor`, `ReadingControls`
- **Utilities**: `utils/writing.ts` for essay management
- **Features**: Word count tracking, AI review integration

#### AI Quiz Module
- **Location**: Integrated in dashboard page
- **API**: `/api/reviewaiapi` for OpenAI integration
- **Features**: Dynamic question generation, real-time scoring

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard with skill selection
│   ├── login/            # Authentication pages
│   ├── signup/
│   ├── profile/          # User profile management
│   ├── reading/[id]/     # Dynamic reading practice pages
│   │   └── [type]/
│   │       ├── page.tsx
│   │       └── review/
│   ├── listening/[id]/   # Dynamic listening practice pages
│   │   └── [type]/
│   │       ├── page.tsx
│   │       └── review/
│   ├── speaking/[id]/    # Dynamic speaking practice pages
│   │   └── [type]/
│   │       └── page.tsx
│   ├── writing/[id]/     # Dynamic writing practice pages
│   │   └── [type]/
│   │       ├── page.tsx
│   │       └── review/
│   ├── api/              # API routes
│   │   ├── reviewaiapi/  # OpenAI integration
│   │   └── submitAnswer/ # Answer submission
│   └── layout.tsx        # Root layout with AuthProvider
├── components/           # Reusable components
│   ├── EssayEditor.tsx
│   ├── ListeningTranscript.tsx
│   ├── ProtectedRoute.tsx
│   ├── QuestionList.tsx
│   ├── ReadingControls.tsx
│   ├── ReadingPassage.tsx
│   ├── SpeakingPrompt.tsx
│   └── WritingPrompt.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── types/               # TypeScript type definitions
│   ├── index.ts
│   ├── reading.ts
│   ├── listening.ts
│   ├── speaking.ts
│   └── writing.ts
└── utils/              # Utility functions
    ├── api.ts          # API client
    ├── contextMenu.ts  # Text highlighting
    ├── listening.ts    # Listening utilities
    ├── reading.ts      # Reading utilities
    ├── speaking.ts     # Speaking utilities
    ├── toast.ts        # Toast notifications
    ├── usePageTitle.ts # Page title management
    └── writing.ts      # Writing utilities
```

## API Architecture

### Backend Integration
- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL` environment variable
- **Authentication**: JWT token management with automatic header injection
- **Error Handling**: Centralized error handling with toast notifications
- **Request Methods**: GET, POST, PUT, DELETE with type-safe responses

### OpenAI Integration
- **Endpoint**: `/api/reviewaiapi`
- **Purpose**: Dynamic question generation and essay review
- **Authentication**: API key from environment or token file
- **Fallback**: Offline question sets for reliability

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI features)

### Installation
```bash
npm install
```

### Environment Configuration
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
OPENAI_API_KEY=your_openai_api_key_here
```

### Development Server
```bash
npm run dev
```

### Build Process
```bash
npm run build
npm start
```

## Code Patterns

### Component Structure
All skill pages follow a consistent pattern:
```typescript
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// Skill-specific imports
```

### State Management
- **Local State**: useState for component-specific data
- **Global State**: AuthContext for user authentication
- **Persistence**: localStorage for progress and answers
- **API State**: Custom hooks for data fetching

### Type Safety
- **Interface Definitions**: Centralized in `/types` directory
- **API Types**: Type-safe API client with generic responses
- **Component Props**: Fully typed component interfaces

## Key Utilities

### API Client (`utils/api.ts`)
- Centralized HTTP client with authentication
- Type-safe request/response handling
- Automatic error handling and retry logic

### Context Menu (`utils/contextMenu.ts`)
- Text selection and highlighting functionality
- Right-click context menu implementation
- Position calculation for text ranges

### Toast Notifications (`utils/toast.ts`)
- User feedback system
- Success/error message display
- Auto-dismiss functionality

## Development Guidelines

### Code Style
- Follow TypeScript strict mode
- Use functional components with hooks
- Implement proper error boundaries
- Maintain consistent naming conventions

### Performance
- Implement proper memoization where needed
- Use Next.js Image component for optimization
- Lazy load non-critical components
- Optimize bundle size with dynamic imports

### Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- API integration testing
- E2E testing for critical user flows

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
- Multi-stage Dockerfile for optimization
- Environment variable configuration
- Health check endpoints
- Static asset optimization

## Backend Dependencies

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration  
- `GET /api/auth/profile` - Profile retrieval
- `PUT /api/auth/profile` - Profile updates

### Answer Submission
- `POST /api/answers/submit` - Submit answers for all skills

## Troubleshooting

### Common Issues
1. **API Connection**: Verify backend URL in environment variables
2. **OpenAI Integration**: Check API key configuration
3. **Authentication**: Clear localStorage for token issues
4. **Build Errors**: Ensure all TypeScript types are properly defined

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` and checking browser console for detailed error messages.
