import express from 'express';
import StudySession from '../models/StudySession.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/study
// @desc    Create new study session
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const session = await StudySession.create({
      userId: req.user._id,
      ...req.body
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/study
// @desc    Get all study sessions for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    const query = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (category) {
      query.category = category;
    }

    const sessions = await StudySession.find(query).sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/study/:id
// @desc    Update study session
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (session) {
      Object.assign(session, req.body);
      const updatedSession = await session.save();
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: 'Study session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/study/:id
// @desc    Delete study session
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (session) {
      await session.deleteOne();
      res.json({ message: 'Study session deleted' });
    } else {
      res.status(404).json({ message: 'Study session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/study/stats/category
// @desc    Get study stats by category
// @access  Private
router.get('/stats/category', protect, async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user._id });

    const categoryStats = sessions.reduce((acc, session) => {
      if (!acc[session.category]) {
        acc[session.category] = {
          totalDuration: 0,
          sessionCount: 0,
          avgCompletion: 0
        };
      }
      
      acc[session.category].totalDuration += session.duration;
      acc[session.category].sessionCount += 1;
      acc[session.category].avgCompletion += session.completionPercentage;
      
      return acc;
    }, {});

    // Calculate averages
    Object.keys(categoryStats).forEach(category => {
      categoryStats[category].avgCompletion = 
        categoryStats[category].avgCompletion / categoryStats[category].sessionCount;
    });

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

