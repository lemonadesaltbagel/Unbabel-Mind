# �� Welcome to Unbabel Mind Setup Guide!

Hey there! 👋 We're excited to have you join the Unbabel Mind project. This guide will walk you through everything you need to get up and running smoothly using Docker. Whether you're a developer, contributor, or just curious about the project, we've got you covered!

## 📋 What You'll Need

Before we dive in, make sure you have these installed on your machine:

- **Docker** and **Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

> 💡 **Pro Tip**: If you're not sure what versions you have, run `docker --version` and `docker-compose --version` in your terminal.

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

## 🔧 Docker Setup (Step by Step)

### Step 1: Get the Code
```bash
git clone <your-repo-url>
cd Unbabel-Mind
```

### Step 2: Set Up the Database

The easiest way is using Docker (recommended):
```bash
# Start PostgreSQL database
docker-compose up -d postgres
```

### Step 3: Configure Environment Variables

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
The frontend is automatically configured to communicate with the backend using Docker service names.

### Step 4: Start the Application

#### Using Docker Compose (Recommended)
```bash
# Start everything with Docker Compose
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
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

The OpenAI API key can only be managed through the Profile page in the application:

1. Start the application and navigate to the Profile page
2. Scroll down to "LLM Token Configuration" section
3. Click "Add Token" or "Edit Token"
4. Enter your OpenAI API key (starts with `sk-`)
5. Click "Save" to persist the configuration

> ⚠️ **Security Note**: The API key is stored securely in a local file that is automatically protected from version control.

### Step 3: LLM Configuration Features

The application includes built-in LLM configuration management:

- **Profile-Based Management**: Configure your OpenAI API token directly from your user profile
- **Secure Storage**: API keys are stored in a local file that's automatically protected from version control
- **User-Friendly Interface**: Simple add/edit interface integrated into the profile page

### Step 4: Start Using the Application
Once the application is running, you can configure your API key through the Profile page. No restart is required after adding your API key.

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
4. Check that Docker is running

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

The application will automatically reload when you make changes to the code.

---

**Happy coding!** 💻 If you have any questions or run into issues, don't hesitate to reach out to the team or check the project documentation.
