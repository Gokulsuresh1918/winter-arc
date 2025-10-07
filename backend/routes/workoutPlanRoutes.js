import express from 'express';
import WorkoutPlan from '../models/WorkoutPlan.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/workout-plans
// @desc    Get all workout plans for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/workout-plans/split/:split
// @desc    Get workout plans by split type
// @access  Private
router.get('/split/:split', protect, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({
      userId: req.user._id,
      split: req.params.split
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/workout-plans
// @desc    Create new workout plan
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.create({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/workout-plans/:id
// @desc    Update workout plan
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (plan) {
      Object.assign(plan, req.body);
      const updatedPlan = await plan.save();
      res.json(updatedPlan);
    } else {
      res.status(404).json({ message: 'Workout plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/workout-plans/:id
// @desc    Delete workout plan
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (plan) {
      await plan.deleteOne();
      res.json({ message: 'Workout plan deleted' });
    } else {
      res.status(404).json({ message: 'Workout plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


