import express from 'express';
import DailySchedule from '../models/DailySchedule.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Default schedule template
const defaultSchedule = [
  { time: '5:30 AM', activity: 'Morning Check-In', details: 'Wake up, quick reflection, mark sleep quality' },
  { time: '6:00 - 7:30 AM', activity: 'Gym', details: 'Track muscle group, sets, reps, and weight' },
  { time: '8:00 - 9:00 AM', activity: 'Breakfast & Get Ready', details: 'Prepare for office, optional gratitude reflection' },
  { time: '9:00 AM - 6:00 PM', activity: 'Office Work', details: 'Focus timer + Pomodoro tracker' },
  { time: '12:30 - 1:30 PM', activity: 'Lunch Break', details: 'Meal log + optional 10-min reading or walk' },
  { time: '5:00 - 7:30 PM', activity: 'Travel / Rest', details: 'Relaxation time, track social media detox' },
  { time: '8:00 - 9:00 PM', activity: 'Family / Entertainment', details: 'Social connection time' },
  { time: '9:00 PM - 12:00 AM', activity: 'Study & Growth', details: 'LeetCode + AI/GenAI/DevOps courses, reading, journaling, meditation' },
  { time: '12:30 AM', activity: 'Sleep', details: 'Prepare for rest, night journaling' }
];

// @route   GET /api/schedule/today
// @desc    Get today's schedule
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let schedule = await DailySchedule.findOne({
      userId: req.user._id,
      date: today
    });
    
    if (!schedule) {
      schedule = await DailySchedule.create({
        userId: req.user._id,
        date: today,
        activities: defaultSchedule.map(item => ({
          ...item,
          completed: false
        }))
      });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/schedule
// @desc    Get schedules with date filter
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
    
    const schedules = await DailySchedule.find(query).sort({ date: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/schedule/:id/morning-checkin
// @desc    Complete morning check-in
// @access  Private
router.put('/:id/morning-checkin', protect, async (req, res) => {
  try {
    const schedule = await DailySchedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (schedule) {
      schedule.morningCheckIn = {
        completed: true,
        time: new Date(),
        ...req.body
      };
      
      const updatedSchedule = await schedule.save();
      res.json(updatedSchedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/schedule/:id/activity/:activityId
// @desc    Update activity status
// @access  Private
router.put('/:id/activity/:activityId', protect, async (req, res) => {
  try {
    const schedule = await DailySchedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (schedule) {
      const activity = schedule.activities.id(req.params.activityId);
      if (activity) {
        Object.assign(activity, req.body);
        if (req.body.completed && !activity.completedAt) {
          activity.completedAt = new Date();
        }
        const updatedSchedule = await schedule.save();
        res.json(updatedSchedule);
      } else {
        res.status(404).json({ message: 'Activity not found' });
      }
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/schedule/:id/pomodoro
// @desc    Log pomodoro session
// @access  Private
router.post('/:id/pomodoro', protect, async (req, res) => {
  try {
    const schedule = await DailySchedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (schedule) {
      schedule.pomodoroSessions.push(req.body);
      const updatedSchedule = await schedule.save();
      res.json(updatedSchedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/schedule/stats/weekly
// @desc    Get weekly schedule stats
// @access  Private
router.get('/stats/weekly', protect, async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const schedules = await DailySchedule.find({
      userId: req.user._id,
      date: { $gte: weekAgo }
    });
    
    const stats = {
      avgCompletionRate: schedules.length > 0
        ? schedules.reduce((sum, s) => sum + s.completionRate, 0) / schedules.length
        : 0,
      totalPomodoros: schedules.reduce((sum, s) => sum + s.totalPomodoros, 0),
      totalFocusTime: schedules.reduce((sum, s) => sum + s.totalFocusTime, 0),
      daysTracked: schedules.length,
      avgSleepQuality: schedules.filter(s => s.morningCheckIn?.sleepQuality).length
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


