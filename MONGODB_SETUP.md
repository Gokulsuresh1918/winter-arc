# 🍃 MongoDB Setup Guide for Windows

This guide will help you set up MongoDB for the Winter Arc application.

## 📌 Choose Your MongoDB Setup

You have two options:
1. **MongoDB Atlas (Cloud)** - Recommended for beginners (no installation needed)
2. **MongoDB Community (Local)** - For advanced users who want local database

---

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google account (free)

### Step 2: Create a Cluster
1. After login, click "Build a Database"
2. Choose **FREE tier** (M0 Sandbox)
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `winterarc`
5. Password: Create a strong password (save it!)
6. User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Confirm with "0.0.0.0/0"
5. Click "Confirm"

⚠️ **Note**: For production, use specific IP addresses only!

### Step 5: Get Connection String
1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It looks like: `mongodb+srv://winterarc:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update Backend Configuration
1. Open `backend/.env` file in Notepad
2. Replace the MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://winterarc:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/winter-arc?retryWrites=true&w=majority
   ```
3. Replace `YOUR_PASSWORD` with the password you created
4. Replace `xxxxx` with your actual cluster address
5. Save the file

✅ **Done!** Your cloud database is ready!

---

## Option 2: MongoDB Community (Local Installation)

### Step 1: Download MongoDB
1. Go to [MongoDB Community Download](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: Latest (e.g., 7.0.4)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. Install MongoDB as a Service: ✅ (checked)
4. Service Name: `MongoDB`
5. Data Directory: `C:\Program Files\MongoDB\Server\7.0\data`
6. Log Directory: `C:\Program Files\MongoDB\Server\7.0\log`
7. Install MongoDB Compass (optional - useful GUI): ✅
8. Click "Install" and wait

### Step 3: Verify Installation
Open Command Prompt and run:
```cmd
mongod --version
```

You should see version information.

### Step 4: Start MongoDB Service
```cmd
net start MongoDB
```

You should see: "The MongoDB service was started successfully."

### Step 5: Update Backend Configuration
1. Open `backend/.env` file
2. Keep the default local connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/winter-arc
   ```
3. Save the file

### Step 6: (Optional) Test Connection
1. Open Command Prompt
2. Run: `mongosh`
3. You should connect to MongoDB shell
4. Type `exit` to quit

✅ **Done!** Your local database is ready!

---

## 🧪 Test Your Setup

After completing either option, test your connection:

1. Make sure your `.env` file has the correct `MONGODB_URI`
2. Start the backend server:
   ```cmd
   cd backend
   npm run dev
   ```
3. Look for the message: **"✅ MongoDB Connected"**

If you see this, your database is working! 🎉

---

## 🔧 Troubleshooting

### Issue: "MongoServerError: Authentication failed"
**Solution**: Check your username and password in the connection string

### Issue: "connect ECONNREFUSED"
**For Atlas**: Check internet connection and IP whitelist
**For Local**: Make sure MongoDB service is running (`net start MongoDB`)

### Issue: "MongooseServerSelectionError"
**For Atlas**: 
- Verify connection string is correct
- Check if cluster is active (not paused)
- Ensure IP is whitelisted

**For Local**:
- Restart MongoDB service: `net stop MongoDB` then `net start MongoDB`

### Issue: MongoDB service won't start (Local)
1. Run Command Prompt as Administrator
2. Try: `net start MongoDB`
3. If still fails, reinstall MongoDB

---

## 📊 MongoDB Compass (Optional GUI)

MongoDB Compass is a visual tool to view your database:

1. Open MongoDB Compass
2. **For Atlas**: Paste your connection string
3. **For Local**: Use `mongodb://localhost:27017`
4. Click "Connect"
5. You can browse collections, view documents, and more!

---

## 🎯 What Happens Next?

Once MongoDB is connected:
- Winter Arc will automatically create the `winter-arc` database
- Collections (users, daylogs, workouts, etc.) are created on first use
- All your data is stored securely
- You can view data anytime through Compass

---

## 💡 Pro Tips

1. **For Atlas**: Keep your cluster active by logging in once a week
2. **For Local**: MongoDB service starts automatically on Windows startup
3. **Backup**: Export important data regularly through Compass
4. **Security**: Never commit `.env` file to GitHub (it contains your password)

---

## 🆘 Still Having Issues?

Common checks:
- [ ] Is `.env` file in the `backend` folder?
- [ ] Did you replace `<password>` in connection string?
- [ ] Is internet connected (for Atlas)?
- [ ] Is MongoDB service running (for Local)?
- [ ] Did you restart Command Prompt after editing `.env`?

---

**Ready to store your transformation journey? Let's go! 💾🔥**

