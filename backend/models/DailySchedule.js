import mongoose from 'mongoose';

const scheduleActivitySchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  details: String,
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  notes: String,
  duration: Number, // actual time spent in minutes
  rating: Number, // 1-5 stars
  focusScore: Number // for work/study activities
});

const pomodoroSessionSchema = new mongoose.Schema({
  startTime: Date,
  endTime: Date,
  duration: Number, // in minutes (25, 50, etc.)
  task: String,
  completed: Boolean,
  interrupted: Boolean
});

const dailyScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Morning check-in
  morningCheckIn: {
    completed: Boolean,
    time: Date,
    sleepQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'terrible']
    },
    sleepHours: Number,
    mood: {
      type: String,
      enum: ['energized', 'good', 'neutral', 'tired', 'exhausted']
    },
    reflection: String,
    gratitude: String
  },
  // Schedule activities
  activities: [scheduleActivitySchema],
  // Pomodoro tracking
  pomodoroSessions: [pomodoroSessionSchema],
  totalFocusTime: {
    type: Number,
    default: 0
  },
  totalPomodoros: {
    type: Number,
    default: 0
  },
  // Daily stats
  completionRate: {
    type: Number,
    default: 0
  },
  productivityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate completion rate before saving
dailyScheduleSchema.pre('save', function(next) {
  if (this.activities && this.activities.length > 0) {
    const completed = this.activities.filter(a => a.completed).length;
    this.completionRate = Math.round((completed / this.activities.length) * 100);
  }
  
  if (this.pomodoroSessions && this.pomodoroSessions.length > 0) {
    this.totalPomodoros = this.pomodoroSessions.filter(p => p.completed).length;
    this.totalFocusTime = this.pomodoroSessions
      .filter(p => p.completed)
      .reduce((sum, p) => sum + p.duration, 0);
  }
  
  next();
});

const DailySchedule = mongoose.model('DailySchedule', dailyScheduleSchema);

export default DailySchedule;



