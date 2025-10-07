import mongoose from 'mongoose';

const exerciseVariationSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ['dumbbell', 'barbell', 'bodyweight', 'machine', 'cable', 'other']
  },
  sets: Number,
  reps: Number,
  weight: Number,
  restTime: Number, // in seconds
  notes: String
});

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    ],
    required: true
  },
  name: String,
  exercises: [exerciseVariationSchema],
  targetMuscles: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  estimatedDuration: Number, // in minutes
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;


