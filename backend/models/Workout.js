import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
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
  split: {
    type: String,
    enum: [
      'chest-triceps',
      'back-biceps',
      'legs',
      'shoulders',
      'abs-core',
      'full-body',
      'push',
      'pull',
      'cardio',
      'custom'
    ]
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['dumbbell', 'barbell', 'bodyweight', 'machine', 'cable', 'other']
    },
    sets: Number,
    reps: Number,
    weight: Number,
    restTime: Number,
    notes: String
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  weight: Number, // body weight in kg
  calories: Number,
  protein: Number, // in grams
  intensity: {
    type: String,
    enum: ['light', 'moderate', 'intense', 'max']
  },
  mood: String,
  notes: String,
  photos: [String] // URLs or paths to progress photos
}, {
  timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;

