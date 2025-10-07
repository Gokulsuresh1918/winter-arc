import express from 'express';
import Challenge from '../models/Challenge.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Motivational quotes for challenges
const motivationalQuotes = [
  "💪 Self-discipline is the bridge between goals and accomplishment.",
  "🔥 The pain you feel today will be the strength you feel tomorrow.",
  "🎯 Success is the sum of small efforts repeated day after day.",
  "⚡ Don't wish it were easier. Wish you were better.",
  "🌟 Discipline is choosing between what you want now and what you want most.",
  "🚀 Your future self will thank you for the discipline you practice today.",
  "💎 The only way to do great work is to love what you do and stay disciplined.",
  "🏆 Champions aren't made in gyms. Champions are made from something deep inside.",
  "🔱 Control your mind or it will control you.",
  "⭐ Every day is a new opportunity to become the person you want to be."
];

// @route   GET /api/challenges
// @desc    Get all challenges for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const challenges = await Challenge.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    // Calculate current streaks
    challenges.forEach(challenge => {
      if (challenge.status === 'active') {
        challenge.calculateStreak();
      }
    });
    
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/challenges/:type/active
// @desc    Get active challenge by type
// @access  Private
router.get('/:type/active', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      userId: req.user._id,
      type: req.params.type,
      status: 'active'
    });
    
    if (challenge) {
      challenge.calculateStreak();
      await challenge.save();
    }
    
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/challenges
// @desc    Start new challenge
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Set default milestones
    const defaultMilestones = [7, 14, 30, 60, 90, 180, 365].map(days => ({
      days,
      achieved: false
    }));
    
    const challenge = await Challenge.create({
      userId: req.user._id,
      ...req.body,
      milestones: defaultMilestones,
      startDate: new Date()
    });
    
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/challenges/:id/reset
// @desc    Reset challenge (for failure/restart)
// @access  Private
router.post('/:id/reset', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (challenge) {
      challenge.resets.push({
        date: new Date(),
        reason: req.body.reason || 'Manual reset',
        streakAtReset: challenge.currentStreak
      });
      
      challenge.startDate = new Date();
      challenge.currentStreak = 0;
      challenge.status = 'active';
      
      // Reset milestones
      challenge.milestones.forEach(milestone => {
        milestone.achieved = false;
        milestone.achievedDate = null;
      });
      
      const updatedChallenge = await challenge.save();
      res.json(updatedChallenge);
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/challenges/:id/log
// @desc    Log daily progress
// @access  Private
router.post('/:id/log', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (challenge) {
      challenge.dailyLogs.push({
        date: new Date(),
        ...req.body
      });
      
      // Update streak and check milestones
      challenge.calculateStreak();
      
      challenge.milestones.forEach(milestone => {
        if (!milestone.achieved && challenge.currentStreak >= milestone.days) {
          milestone.achieved = true;
          milestone.achievedDate = new Date();
        }
      });
      
      const updatedChallenge = await challenge.save();
      res.json(updatedChallenge);
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/challenges/:id
// @desc    Update challenge
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (challenge) {
      Object.assign(challenge, req.body);
      const updatedChallenge = await challenge.save();
      res.json(updatedChallenge);
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/challenges/quote/motivation
// @desc    Get motivational quote
// @access  Public
router.get('/quote/motivation', (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    res.json({ quote: motivationalQuotes[randomIndex] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/challenges/:id
// @desc    Delete challenge
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (challenge) {
      await challenge.deleteOne();
      res.json({ message: 'Challenge deleted' });
    } else {
      res.status(404).json({ message: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



