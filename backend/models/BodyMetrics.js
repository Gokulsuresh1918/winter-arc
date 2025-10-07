import mongoose from 'mongoose';

const bodyMetricsSchema = new mongoose.Schema({
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
  weight: {
    type: Number, // in kg
    required: true
  },
  height: {
    type: Number, // in cm
    required: true
  },
  bmi: {
    type: Number,
    default: 0
  },
  bmiCategory: {
    type: String,
    enum: ['Underweight', 'Normal', 'Overweight', 'Obese'],
    default: 'Normal'
  },
  bodyFat: Number, // percentage
  muscleMass: Number, // kg
  notes: String
}, {
  timestamps: true
});

// Calculate BMI and category before saving
bodyMetricsSchema.pre('save', function(next) {
  // BMI = weight (kg) / (height (m))^2
  const heightInMeters = this.height / 100;
  this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  
  // Determine BMI category
  if (this.bmi < 18.5) {
    this.bmiCategory = 'Underweight';
  } else if (this.bmi >= 18.5 && this.bmi < 25) {
    this.bmiCategory = 'Normal';
  } else if (this.bmi >= 25 && this.bmi < 30) {
    this.bmiCategory = 'Overweight';
  } else {
    this.bmiCategory = 'Obese';
  }
  
  next();
});

const BodyMetrics = mongoose.model('BodyMetrics', bodyMetricsSchema);

export default BodyMetrics;



