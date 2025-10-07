import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['nofap', 'social-media-detox', 'custom'],
    required: true
  },
  name: String,
  startDate: {
    type: Date,
    required: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'failed'],
    default: 'active'
  },
  resets: [{
    date: Date,
    reason: String,
    streakAtReset: Number
  }],
  milestones: [{
    days: Number,
    achieved: Boolean,
    achievedDate: Date
  }],
  dailyLogs: [{
    date: Date,
    success: Boolean,
    mood: String,
    notes: String,
    screenTime: Number // for social media detox
  }]
}, {
  timestamps: true
});

// Calculate current streak
challengeSchema.methods.calculateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(this.startDate);
  startDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
  this.currentStreak = daysDiff;
  
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak;
  }
  
  return this.currentStreak;
};

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;


