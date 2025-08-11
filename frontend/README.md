# Reading Next.js Frontend

This is the frontend application for the Unbabel Mind project, built with Next.js 15, React 19, and TypeScript.

## Features

- **Modern React**: Built with React 19 and Next.js 15
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark Theme**: Built-in dark mode support
- **Hot Reloading**: Fast development with hot module replacement

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── profile/          # Profile page
│   ├── reading/          # Reading module
│   ├── listening/        # Listening module
│   ├── speaking/         # Speaking module
│   └── writing/          # Writing module
├── components/            # Reusable React components
├── contexts/              # React contexts for state management
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions and helpers
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development only)

### Development

The frontend is designed to run exclusively through Docker. To start development:

```bash
# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Backend API URL (for internal communication)
NEXT_PUBLIC_API_URL=http://backend:3001/api
```

## Available Scripts

- `npm run build` - Build the application for production

## Technology Stack

- **Framework**: Next.js 15.3.5
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9
- **Containerization**: Docker

## Development Workflow

1. **Code Changes**: Edit files in the `src/` directory
2. **Hot Reloading**: Changes automatically reflect in the browser
3. **Type Checking**: TypeScript provides real-time type checking
4. **Linting**: ESLint ensures code quality

## Building for Production

```bash
# Build the application
npm run build

# The built application will be in the .next directory
```

## Docker Development

The frontend container includes:

- **Volume Mounting**: Source code is mounted for live development
- **Hot Reloading**: Changes are reflected immediately
- **Network Access**: Communicates with backend via Docker network
- **Environment Variables**: Automatically configured for Docker environment

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all dependencies are properly installed
2. **Type Errors**: Check TypeScript configuration and type definitions
3. **Styling Issues**: Verify Tailwind CSS configuration
4. **API Connection**: Ensure backend service is running and accessible

### Debug Commands

```bash
# Check container logs
docker logs unbabel-frontend

# Access container shell
docker exec -it unbabel-frontend sh

# Rebuild container
docker-compose build frontend
```

## Contributing

1. Follow the project's coding standards
2. Ensure all TypeScript types are properly defined
3. Test changes in the Docker environment
4. Update documentation as needed

## License

This project is licensed under the MIT License.
