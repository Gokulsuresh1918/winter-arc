# ❄️ Difference - Personal Transformation Assistant

A complete full-stack web application designed to help you track, reflect, and stay motivated across your daily routine, fitness, career growth, and mindset. Built with a beautiful dark theme, smooth animations, and an intuitive user experience.

![Difference](https://img.shields.io/badge/Difference-Transform%20•%20Evolve%20•%20Conquer-0ea5e9?style=for-the-badge)

## ✨ Features

### 🕒 Daily Routine Tracker
- Interactive timeline for your day (customizable wake/sleep times)
- Track tasks: Meditation, Gym, Study, Journaling, Reading
- Status indicators (✅ Completed / ❌ Skipped / 🔄 Pending)
- Daily progress visualization
- Day rating system (1-5 stars)

### 💪 Fitness Tracker
- Log gym sessions with exercises, sets, reps, and weights
- Track body weight, calories, and protein intake
- Weekly analytics with beautiful charts
- Progress visualization with Recharts
- Workout history and stats

### 🧠 Study Tracker
- Log study sessions with topic, duration, and notes
- Track progress across categories:
  - Cloud & DevOps
  - Software Architecture
  - System Design
  - Projects / LeetCode
- Completion percentage for each session
- Category-wise progress analytics with pie charts

### 🧘 Mind & Reflection
- 10-minute meditation timer with circular progress
- Night journaling form:
  - "What did I improve today?"
  - "What challenged me?"
  - "What am I grateful for?"
- Reading tracker (pages per day)
- Daily motivational quote/mantra generator

### 📈 Milestone System
- Automatic badge awards:
  - 🔥 Consistency King (7-day streak)
  - ⚡ Focus Warrior (10+ study sessions)
  - 🧘 Zen Mind (7 meditation days)
- Badge display on profile dashboard

### 👤 Profile Management
- Editable personal information
- Custom goals and focus quotes
- Current and longest streak tracking
- Winter Arc journey progress (90-day goal)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```cmd
cd backend
```

2. Install dependencies:
```cmd
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/winter-arc
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```cmd
mongod
```

5. Start the backend server:
```cmd
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```cmd
cd frontend
```

2. Install dependencies:
```cmd
npm install
```

3. Start the development server:
```cmd
npm run dev
```

The frontend will run on `http://localhost:3000`

### Running the Full Application

Open two terminal windows:

**Terminal 1 (Backend):**
```cmd
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```cmd
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser!

## 📱 Usage Guide

### Getting Started

1. **Register**: Create a new account with your name, email, and password
2. **Login**: Sign in to access your personal dashboard
3. **Set Goals**: Visit your profile to customize your goals and schedule

### Daily Workflow

**Morning (5:30 AM - 6:00 AM)**
- Open the dashboard to see your daily motivational quote
- Review your tasks for the day
- Start with meditation (Mind page)

**Throughout the Day**
- Mark tasks as completed or skipped
- Log workouts after gym sessions
- Track study sessions with notes
- Update reading progress

**Evening (10:00 PM - 11:00 PM)**
- Complete your night reflection journal
- Rate your day (1-5 stars)
- Review your weekly progress

### Tips for Maximum Impact
- ✅ Complete at least 3 tasks daily to maintain your streak
- 📊 Check the fitness and study analytics weekly
- 🎯 Set realistic completion percentages for study sessions
- 📝 Be honest and detailed in your journal reflections
- 🔥 Aim for a 7-day streak to earn your first badge!

## 🎨 UI Design Philosophy

- **Dark Theme**: Easy on the eyes during late-night sessions
- **Glow Effects**: Subtle neon glows for an engaging futuristic feel
- **Smooth Animations**: Framer Motion for delightful micro-interactions
- **Glass Morphism**: Modern frosted-glass card designs
- **Responsive**: Works beautifully on desktop and mobile devices

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  goal: String,
  wakeTime: String,
  sleepTime: String,
  focusQuote: String,
  currentStreak: Number,
  longestStreak: Number,
  badges: [{ name, icon, earnedAt }]
}
```

### DayLog
```javascript
{
  userId: ObjectId,
  date: Date,
  tasks: {
    meditation: { status, duration, notes },
    gym: { status, duration, notes },
    study: { status, duration, notes },
    journal: { status, duration, notes },
    reading: { status, duration, notes }
  },
  rating: Number (1-5)
}
```

### Workout
```javascript
{
  userId: ObjectId,
  date: Date,
  exercises: [{ name, sets, reps, weight }],
  duration: Number,
  weight: Number,
  calories: Number,
  protein: Number
}
```

### StudySession
```javascript
{
  userId: ObjectId,
  topic: String,
  category: String,
  duration: Number,
  completionPercentage: Number,
  notes: String,
  date: Date
}
```

### JournalEntry
```javascript
{
  userId: ObjectId,
  date: Date,
  improvement: String,
  challenge: String,
  gratitude: String,
  mood: String
}
```

## 🚀 Deployment

### Frontend (Vercel)
```cmd
cd frontend
npm run build
vercel --prod
```

### Backend (Render / Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy!

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/badges` - Award badge

### Day Logs
- `GET /api/daylogs/today` - Get today's log
- `GET /api/daylogs` - Get all logs (with date filters)
- `PUT /api/daylogs/:id` - Update day log
- `GET /api/daylogs/streak` - Get current streak

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats/weekly` - Get weekly stats

### Study Sessions
- `GET /api/study` - Get all sessions
- `POST /api/study` - Create session
- `PUT /api/study/:id` - Update session
- `DELETE /api/study/:id` - Delete session
- `GET /api/study/stats/category` - Get category stats

### Journal Entries
- `GET /api/journal` - Get all entries
- `POST /api/journal` - Create entry
- `GET /api/journal/today/entry` - Get today's entry

### Quotes
- `GET /api/quotes/daily` - Get daily quote
- `GET /api/quotes/random` - Get random quote

## 🎯 Future Enhancements

- [ ] PWA support for mobile installation
- [ ] Push notifications (morning motivation & night reminders)
- [ ] Weekly summary PDF export
- [ ] Photo upload for fitness progress
- [ ] Spotify integration for focus playlists
- [ ] Social features (share streaks, compete with friends)
- [ ] Dark/Light theme toggle
- [ ] Multiple language support
- [ ] Advanced analytics dashboard

## 📝 License

MIT License - feel free to use this for your own transformation journey!

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 💪 Motivation

> "Discipline over motivation. Consistency over intensity."

Difference isn't just an app—it's a mindset. A commitment to yourself. A promise that no matter how challenging the journey, you'll keep pushing forward to make a difference.

**Your future self is watching. Make them proud.** 🔥

---

Built with 💙 by a developer committed to personal growth and excellence.

**Day 1 or One Day? You decide.**

