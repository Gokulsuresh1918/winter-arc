import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.goal = req.body.goal || user.goal;
      user.wakeTime = req.body.wakeTime || user.wakeTime;
      user.sleepTime = req.body.sleepTime || user.sleepTime;
      user.focusQuote = req.body.focusQuote || user.focusQuote;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        goal: updatedUser.goal,
        wakeTime: updatedUser.wakeTime,
        sleepTime: updatedUser.sleepTime,
        focusQuote: updatedUser.focusQuote,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak,
        badges: updatedUser.badges
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users/badges
// @desc    Award badge to user
// @access  Private
router.post('/badges', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, icon } = req.body;

    // Check if badge already exists
    const badgeExists = user.badges.some(badge => badge.name === name);

    if (!badgeExists) {
      user.badges.push({
        name,
        icon,
        earnedAt: new Date()
      });
      await user.save();
    }

    res.json(user.badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

