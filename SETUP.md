# 🚀 Welcome to Unbabel-Mind Setup Guide!

Hey there! 👋 We're excited to have you join the Unbabel-Mind project. This guide will walk you through everything you need to get up and running smoothly. Whether you're a developer, contributor, or just curious about the project, we've got you covered!

## 📋 What You'll Need

Before we dive in, make sure you have these installed on your machine:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Docker** and **Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

> 💡 **Pro Tip**: If you're not sure what versions you have, run `node --version`, `npm --version`, and `docker --version` in your terminal.

## 🎯 Quick Start (The Easy Way)

If you want to get everything running in one go, here's the simplest approach using Docker Compose:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Unbabel-Mind

# 2. Start everything with Docker Compose
docker-compose up --build
```

That's it! 🎉 Your application should now be running at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: PostgreSQL on port 5432

> 💡 **What's happening**: Docker Compose automatically sets up the database, installs dependencies, and starts all services for you. No manual configuration needed!

## 🔧 Detailed Alternative Setup by npm (Step by Step)

Prefer to understand what's happening under the hood? Let's break it down:

### Step 1: Get the Code
```bash
git clone <your-repo-url>
cd Unbabel-Mind
```

### Step 2: Install Dependencies

We have a convenient script that installs everything:
```bash
npm run install:all
```

Or if you prefer to do it manually:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### Step 3: Set Up the Database

The easiest way is using Docker (recommended):
```bash
# Start PostgreSQL database
npm run db:up
```

Or if you prefer to run PostgreSQL locally:
1. Install PostgreSQL on your system
2. Create a database named `unbabel`
3. Update the backend environment variables (see Environment Setup below)

### Step 4: Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `backend` directory:
```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your database settings:
```env
PORT=3001
DB_HOST=postgres
DB_PORT=5432
DB_NAME=unbabel
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Frontend Configuration
Create a `.env.local` file in the `frontend` directory:
```bash
cd frontend
touch .env.local
```

Add this content:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 5: Start the Application

#### Option A: Docker Compose (Recommended)
```bash
# Start everything with Docker Compose
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

#### Option B: Manual Setup
```bash
# Start database
npm run db:up

# Start backend (in one terminal)
npm run dev:backend

# Start frontend (in another terminal)
npm run dev:frontend
```

#### Option C: Using npm scripts
```bash
# Start everything using npm scripts
npm run start
```

## 🤖 Setting Up AI Features (LLM Token)

To unlock the AI-powered features, you'll need an OpenAI API key:

### Step 1: Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in your dashboard
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### Step 2: Configure the API Key

#### Method A: Environment Variable (Recommended)
Add this to your `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
OPENAI_API_KEY=sk-your-actual-api-key-here
```

#### Method B: Token File
Edit the `frontend/openai_token.txt` file:
```bash
cd frontend
echo "sk-your-actual-api-key-here" > openai_token.txt
```

> ⚠️ **Security Note**: Never commit your API key to version control! The `.env.local` file is already in `.gitignore` to keep your key safe.

### Step 3: Restart the Frontend
After adding your API key, restart the frontend:
```bash
# If using npm run start, stop and restart
# If running individually:
npm run dev:frontend
```

## 🧪 Testing Your Setup

Once everything is running, you can test the setup:

1. **Frontend**: Visit http://localhost:3000
2. **Backend Health Check**: Visit http://localhost:3001/api/health
3. **Database**: The backend will automatically create tables on first run

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill the process or change ports in your config
```

#### Database Connection Issues
```bash
# Reset database (Docker)
docker-compose down -v
docker-compose up --build

# Check database logs
docker-compose logs postgres
```

#### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

#### Docker Issues
```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Rebuild everything
docker-compose build --no-cache
docker-compose up
```

### Getting Help

If you're still having issues:
1. Check the logs: `docker-compose logs -f`
2. Verify your environment variables
3. Make sure all ports are available
4. Check that Docker is running (if using Docker)

## 🎉 You're All Set!

Congratulations! 🎊 You should now have:
- ✅ A running frontend at http://localhost:3000
- ✅ A backend API at http://localhost:3001
- ✅ A PostgreSQL database
- ✅ AI features configured (if you added the OpenAI key)

## 📚 Next Steps

Now that you're up and running:
1. Explore the application at http://localhost:3000
2. Check out the API documentation in the backend README
3. Start developing! 🚀

## 🔄 Development Workflow

For ongoing development:

### Using Docker Compose (Recommended)
```bash
# Start everything
docker-compose up --build

# The application will automatically reload when you make changes to the code
```

### Using npm scripts
```bash
# Start everything
npm run start

# Or run services individually for faster development
npm run dev:backend  # Terminal 1
npm run dev:frontend # Terminal 2
```

The application will automatically reload when you make changes to the code.

---

**Happy coding!** 💻 If you have any questions or run into issues, don't hesitate to reach out to the team or check the project documentation.
