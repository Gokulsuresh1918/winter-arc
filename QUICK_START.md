# ⚡ Winter Arc - Quick Start Reference

## 🚀 5-Minute Setup

### 1️⃣ Install Dependencies

**Backend:**
```cmd
cd backend
npm install
```

**Frontend:**
```cmd
cd frontend
npm install
```

### 2️⃣ Configure Database

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/winter-arc
# OR for Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/winter-arc
```

### 3️⃣ Start Servers

**Option A - Manual (2 terminals):**

Terminal 1:
```cmd
cd backend
npm run dev
```

Terminal 2:
```cmd
cd frontend
npm run dev
```

**Option B - Quick Start (Windows):**
```cmd
START.bat
```

### 4️⃣ Open App
```
http://localhost:3000
```

---

## 📍 Important URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | Main app |
| Backend | http://localhost:5000 | API server |
| Health Check | http://localhost:5000/api/health | Test endpoint |

---

## 🔑 Default Ports

- **Frontend**: 3000
- **Backend**: 5000
- **MongoDB Local**: 27017
- **MongoDB Atlas**: Cloud (SRV connection)

---

## 📂 Key Files

```
📁 backend/
  ├── .env                 ⚙️ Configuration (create this!)
  ├── server.js            🚀 Entry point
  └── package.json         📦 Dependencies

📁 frontend/
  ├── src/App.jsx          🏠 Main app
  ├── src/pages/           📄 All pages
  └── package.json         📦 Dependencies
```

---

## 🎯 First-Time Setup Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB ready (local or Atlas)
- [ ] Backend `.env` file created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Browser opened to localhost:3000
- [ ] Account created
- [ ] First task logged!

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check `.env` file exists in backend folder |
| MongoDB error | Verify `MONGODB_URI` in `.env` |
| Port already in use | Change `PORT` in backend `.env` |
| White screen | Check backend is running first |
| Login fails | Check backend console for errors |
| Can't register | MongoDB must be connected |

---

## 🎨 App Navigation

```
Login/Register
    ↓
Dashboard ─────┬───→ Fitness (Log workouts)
               ├───→ Study (Track learning)
               ├───→ Mind (Meditate & journal)
               └───→ Profile (View progress)
```

---

## 💡 Quick Tips

1. **Start Backend First** - Frontend needs backend to work
2. **Keep Terminals Open** - Don't close while using app
3. **Check Console** - Errors show in terminal windows
4. **First User** - Register with any email (gokul@example.com works)
5. **Daily Reset** - Tasks reset at midnight automatically
6. **Streak Building** - Complete 3+ tasks daily to maintain streak

---

## 📞 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Check `MONGODB_SETUP.md` for database setup
3. Check terminal windows for error messages
4. Verify both servers are running
5. Try refreshing the browser

---

## 🔥 Ready to Start?

```cmd
# Option 1: Use the quick start script
START.bat

# Option 2: Manual start
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

**Then open:** http://localhost:3000

---

## 📊 Default Test Account

For testing, you can create:
- **Email**: gokul@winterarc.com
- **Password**: gokul123
- **Name**: Gokul

---

## 🎯 Your First Day

1. ✅ Register/Login
2. ✅ Read the daily quote
3. ✅ Mark a task as complete
4. ✅ Log a workout or study session
5. ✅ Write a journal entry
6. ✅ Rate your day
7. ✅ Check your streak: Day 1! 🔥

---

**Winter Arc starts NOW! Let's go! 💪**

*Remember: "Discipline over motivation. Consistency over intensity."*

