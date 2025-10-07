import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Cloud & DevOps', 'Software Architecture', 'System Design', 'Projects', 'LeetCode', 'Other'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  notes: String,
  completionPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

const StudySession = mongoose.model('StudySession', studySessionSchema);

export default StudySession;

