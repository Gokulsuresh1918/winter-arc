import express from 'express';
import FoodLog from '../models/FoodLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Healthy recipe tips
const healthyRecipes = [
  "🥗 Try Greek yogurt with berries and nuts for a protein-rich breakfast",
  "🍳 Scrambled eggs with spinach and tomatoes = power breakfast",
  "🥑 Avocado toast with poached eggs and seeds for healthy fats",
  "🍲 Quinoa bowl with grilled chicken and vegetables",
  "🥤 Green smoothie: spinach, banana, protein powder, almond milk",
  "🐟 Baked salmon with sweet potato and broccoli",
  "🥙 Chicken wrap with hummus, lettuce, and veggies",
  "🍝 Whole grain pasta with turkey meatballs and marinara",
  "🥗 Chickpea salad with olive oil and lemon dressing",
  "🍛 Lentil curry with brown rice"
];

// @route   GET /api/food/today
// @desc    Get today's food log
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let foodLog = await FoodLog.findOne({
      userId: req.user._id,
      date: today
    });
    
    if (!foodLog) {
      foodLog = await FoodLog.create({
        userId: req.user._id,
        date: today,
        goals: {
          calories: 2000,
          protein: 150,
          water: 3
        }
      });
    }
    
    res.json(foodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/food
// @desc    Get food logs with date filter
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const foodLogs = await FoodLog.find(query).sort({ date: -1 });
    res.json(foodLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/food/:id
// @desc    Update food log
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const foodLog = await FoodLog.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (foodLog) {
      Object.assign(foodLog, req.body);
      const updatedLog = await foodLog.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Food log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/food/recipe/daily
// @desc    Get daily healthy recipe tip
// @access  Public
router.get('/recipe/daily', (req, res) => {
  try {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const recipeIndex = dayOfYear % healthyRecipes.length;
    
    res.json({ recipe: healthyRecipes[recipeIndex] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/food/stats/weekly
// @desc    Get weekly nutrition stats
// @access  Private
router.get('/stats/weekly', protect, async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const foodLogs = await FoodLog.find({
      userId: req.user._id,
      date: { $gte: weekAgo }
    });
    
    const stats = {
      avgCalories: foodLogs.length > 0
        ? Math.round(foodLogs.reduce((sum, log) => sum + (log.totalCalories || 0), 0) / foodLogs.length)
        : 0,
      avgProtein: foodLogs.length > 0
        ? Math.round(foodLogs.reduce((sum, log) => sum + (log.totalProtein || 0), 0) / foodLogs.length)
        : 0,
      avgWater: foodLogs.length > 0
        ? (foodLogs.reduce((sum, log) => sum + (log.waterIntake || 0), 0) / foodLogs.length).toFixed(1)
        : 0,
      daysLogged: foodLogs.length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


