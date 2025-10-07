import express from 'express';
import DayLog from '../models/DayLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/daylogs/today
// @desc    Get today's log
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let dayLog = await DayLog.findOne({
      userId: req.user._id,
      date: today
    });

    // Create new day log if doesn't exist
    if (!dayLog) {
      dayLog = await DayLog.create({
        userId: req.user._id,
        date: today
      });
    }

    res.json(dayLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/daylogs
// @desc    Get all day logs for user
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

    const dayLogs = await DayLog.find(query).sort({ date: -1 });
    res.json(dayLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/daylogs/:id
// @desc    Update day log
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const dayLog = await DayLog.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (dayLog) {
      // Update tasks
      if (req.body.tasks) {
        dayLog.tasks = { ...dayLog.tasks, ...req.body.tasks };
      }
      
      if (req.body.notes !== undefined) dayLog.notes = req.body.notes;
      if (req.body.rating !== undefined) dayLog.rating = req.body.rating;

      const updatedLog = await dayLog.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Day log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/daylogs/streak
// @desc    Get current streak
// @access  Private
router.get('/streak', protect, async (req, res) => {
  try {
    const dayLogs = await DayLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(100);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const log of dayLogs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      // Check if at least 3 tasks are completed
      const completedTasks = Object.values(log.tasks).filter(
        task => task.status === 'completed'
      ).length;

      if (completedTasks >= 3) {
        const daysDiff = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

