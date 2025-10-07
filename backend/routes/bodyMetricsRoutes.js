import express from 'express';
import BodyMetrics from '../models/BodyMetrics.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/body-metrics
// @desc    Log body metrics
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const metrics = await BodyMetrics.create({
      userId: req.user._id,
      ...req.body
    });
    
    res.status(201).json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/body-metrics
// @desc    Get all body metrics for user
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
    
    const metrics = await BodyMetrics.find(query).sort({ date: -1 });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/body-metrics/latest
// @desc    Get latest body metrics
// @access  Private
router.get('/latest', protect, async (req, res) => {
  try {
    const metrics = await BodyMetrics.findOne({ userId: req.user._id })
      .sort({ date: -1 });
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/body-metrics/:id
// @desc    Update body metrics
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const metrics = await BodyMetrics.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (metrics) {
      Object.assign(metrics, req.body);
      const updatedMetrics = await metrics.save();
      res.json(updatedMetrics);
    } else {
      res.status(404).json({ message: 'Body metrics not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/body-metrics/:id
// @desc    Delete body metrics
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const metrics = await BodyMetrics.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (metrics) {
      await metrics.deleteOne();
      res.json({ message: 'Body metrics deleted' });
    } else {
      res.status(404).json({ message: 'Body metrics not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/body-metrics/progress
// @desc    Get weight progress data
// @access  Private
router.get('/progress/weight', protect, async (req, res) => {
  try {
    const metrics = await BodyMetrics.find({ userId: req.user._id })
      .sort({ date: 1 })
      .limit(30);
    
    const progressData = metrics.map(m => ({
      date: m.date,
      weight: m.weight,
      bmi: m.bmi
    }));
    
    res.json(progressData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



