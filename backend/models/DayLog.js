import mongoose from 'mongoose';

const dayLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  tasks: {
    meditation: {
      status: { type: String, enum: ['completed', 'skipped', 'pending'], default: 'pending' },
      duration: { type: Number, default: 0 },
      notes: String
    },
    gym: {
      status: { type: String, enum: ['completed', 'skipped', 'pending'], default: 'pending' },
      duration: { type: Number, default: 0 },
      notes: String
    },
    study: {
      status: { type: String, enum: ['completed', 'skipped', 'pending'], default: 'pending' },
      duration: { type: Number, default: 0 },
      notes: String
    },
    journal: {
      status: { type: String, enum: ['completed', 'skipped', 'pending'], default: 'pending' },
      duration: { type: Number, default: 0 },
      notes: String
    },
    reading: {
      status: { type: String, enum: ['completed', 'skipped', 'pending'], default: 'pending' },
      duration: { type: Number, default: 0 },
      notes: String
    }
  },
  morningRoutine: {
    brushTeeth: { type: Boolean, default: false },
    skincare: { type: Boolean, default: false },
    underEyeCream: { type: Boolean, default: false },
    moisturizer: { type: Boolean, default: false },
    sunscreen: { type: Boolean, default: false }
  },
  eveningRoutine: {
    brushTeeth: { type: Boolean, default: false },
    skincare: { type: Boolean, default: false },
    underEyeCream: { type: Boolean, default: false },
    moisturizer: { type: Boolean, default: false }
  },
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Compound index to ensure one log per user per day
dayLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DayLog = mongoose.model('DayLog', dayLogSchema);

export default DayLog;

