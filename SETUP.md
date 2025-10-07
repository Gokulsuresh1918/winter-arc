# 🚀 Quick Setup Guide for Winter Arc

This guide will help you get the Winter Arc app running on your machine in minutes!

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- [ ] **MongoDB** - Choose one option:
  - Option A: [MongoDB Community Server](https://www.mongodb.com/try/download/community) (local)
  - Option B: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (cloud - free tier available)
- [ ] **Command Prompt or Terminal** access

## 🎯 Step-by-Step Installation

### Step 1: Verify Node.js Installation

Open Command Prompt and run:
```cmd
node --version
npm --version
```

You should see version numbers (e.g., v18.17.0). If not, install Node.js first.

### Step 2: Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```
3. Your connection string will be: `mongodb://localhost:27017/winter-arc`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (free tier is fine)
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for testing)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/winter-arc`)

### Step 3: Backend Setup

1. Open Command Prompt and navigate to the project:
   ```cmd
   cd C:\Users\Acer\Desktop\backup\tracker
   cd backend
   ```

2. Install backend dependencies:
   ```cmd
   npm install
   ```

3. Create a `.env` file in the `backend` folder:
   ```cmd
   copy .env.example .env
   ```

4. Edit the `.env` file with your settings:
   - Open `backend\.env` in Notepad
   - Update `MONGODB_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a random secure string
   - Save and close

5. Start the backend server:
   ```cmd
   npm run dev
   ```

   ✅ You should see: "Server running on port 5000" and "MongoDB Connected"

### Step 4: Frontend Setup

1. Open a **NEW** Command Prompt window
2. Navigate to the frontend:
   ```cmd
   cd C:\Users\Acer\Desktop\backup\tracker
   cd frontend
   ```

3. Install frontend dependencies:
   ```cmd
   npm install
   ```

4. Start the development server:
   ```cmd
   npm run dev
   ```

   ✅ You should see: "Local: http://localhost:3000"

### Step 5: Access the App

1. Open your browser
2. Go to: `http://localhost:3000`
3. Click "Create Account" to register
4. Fill in your details and start your Winter Arc journey! 🔥

## 🎉 You're All Set!

You should now have:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:3000
- ✅ MongoDB connected and ready

## 🐛 Troubleshooting

### Issue: "MongoDB Connection Failed"
- **Check**: Is MongoDB running? (For local: `net start MongoDB`)
- **Check**: Is your connection string correct in `.env`?
- **Check**: For Atlas, is your IP whitelisted?

### Issue: "Port 5000 already in use"
- **Solution**: Change the `PORT` in `backend/.env` to another number (e.g., 5001)

### Issue: "Port 3000 already in use"
- **Solution**: The frontend will automatically suggest port 3001. Accept it.

### Issue: "npm: command not found"
- **Solution**: Restart your computer after installing Node.js

### Issue: "Cannot find module"
- **Solution**: Delete `node_modules` folder and run `npm install` again

## 📱 Next Steps

1. **Register an account** - Use a real email (or fake one for testing)
2. **Complete the onboarding** - Set your goals and schedule
3. **Start logging** - Add your first workout, study session, or journal entry
4. **Build your streak** - Aim for 7 days to get your first badge!

## 💡 Pro Tips

- Keep both Command Prompt windows open while using the app
- The backend must be running for the frontend to work
- Data is saved automatically - no need to manually save
- Press `Ctrl+C` in each window to stop the servers when done

## 🆘 Need Help?

If you encounter issues:
1. Check that both servers are running (backend + frontend)
2. Check the Command Prompt for error messages
3. Make sure MongoDB is connected
4. Try clearing browser cache and refreshing

---

**Ready to transform? Let's go! 💪🔥**

The Winter Arc starts TODAY!

