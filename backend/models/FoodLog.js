import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: String,
  items: [String],
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  notes: String
});

const foodLogSchema = new mongoose.Schema({
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
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
  snacks: [mealSchema],
  waterIntake: {
    type: Number, // in liters
    default: 0
  },
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFats: Number,
  goals: {
    calories: Number,
    protein: Number,
    water: Number
  },
  notes: String
}, {
  timestamps: true
});

// Calculate totals before saving
foodLogSchema.pre('save', function(next) {
  const meals = [this.breakfast, this.lunch, this.dinner, ...(this.snacks || [])];
  
  this.totalCalories = meals.reduce((sum, meal) => sum + (meal?.calories || 0), 0);
  this.totalProtein = meals.reduce((sum, meal) => sum + (meal?.protein || 0), 0);
  this.totalCarbs = meals.reduce((sum, meal) => sum + (meal?.carbs || 0), 0);
  this.totalFats = meals.reduce((sum, meal) => sum + (meal?.fats || 0), 0);
  
  next();
});

const FoodLog = mongoose.model('FoodLog', foodLogSchema);

export default FoodLog;


