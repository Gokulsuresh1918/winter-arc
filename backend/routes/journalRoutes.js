import express from 'express';
import JournalEntry from '../models/JournalEntry.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/journal
// @desc    Create new journal entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const entry = await JournalEntry.create({
      userId: req.user._id,
      ...req.body
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/journal
// @desc    Get all journal entries for user
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

    const entries = await JournalEntry.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/journal/:id
// @desc    Get journal entry by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (entry) {
      res.json(entry);
    } else {
      res.status(404).json({ message: 'Journal entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/journal/:id
// @desc    Update journal entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (entry) {
      Object.assign(entry, req.body);
      const updatedEntry = await entry.save();
      res.json(updatedEntry);
    } else {
      res.status(404).json({ message: 'Journal entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/journal/today/entry
// @desc    Get today's journal entry
// @access  Private
router.get('/today/entry', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const entry = await JournalEntry.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (entry) {
      res.json(entry);
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

