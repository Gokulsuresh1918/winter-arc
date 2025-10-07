import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dayLogRoutes from './routes/dayLogRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import workoutPlanRoutes from './routes/workoutPlanRoutes.js';
import studyRoutes from './routes/studyRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import bodyMetricsRoutes from './routes/bodyMetricsRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/daylogs', dayLogRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/body-metrics', bodyMetricsRoutes);
app.use('/api/schedule', scheduleRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Winter Arc Backend is running! 🔥' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

