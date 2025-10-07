import express from 'express';
import FinanceLog from '../models/FinanceLog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/finance/today
// @desc    Get today's finance log
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let financeLog = await FinanceLog.findOne({
      userId: req.user._id,
      date: today
    });
    
    if (!financeLog) {
      financeLog = await FinanceLog.create({
        userId: req.user._id,
        date: today
      });
    }
    
    res.json(financeLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/finance
// @desc    Get finance logs with date filter
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
    
    const financeLogs = await FinanceLog.find(query).sort({ date: -1 });
    res.json(financeLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/finance/:id/transaction
// @desc    Add transaction to finance log
// @access  Private
router.post('/:id/transaction', protect, async (req, res) => {
  try {
    const financeLog = await FinanceLog.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (financeLog) {
      financeLog.transactions.push(req.body);
      const updatedLog = await financeLog.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Finance log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/finance/:id/transaction/:transactionId
// @desc    Delete transaction
// @access  Private
router.delete('/:id/transaction/:transactionId', protect, async (req, res) => {
  try {
    const financeLog = await FinanceLog.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (financeLog) {
      financeLog.transactions = financeLog.transactions.filter(
        t => t._id.toString() !== req.params.transactionId
      );
      const updatedLog = await financeLog.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Finance log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/finance/stats/monthly
// @desc    Get monthly finance stats
// @access  Private
router.get('/stats/monthly', protect, async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const financeLogs = await FinanceLog.find({
      userId: req.user._id,
      date: { $gte: firstDayOfMonth }
    });
    
    const stats = {
      totalIncome: financeLogs.reduce((sum, log) => sum + log.totalIncome, 0),
      totalExpense: financeLogs.reduce((sum, log) => sum + log.totalExpense, 0),
      balance: financeLogs.reduce((sum, log) => sum + log.balance, 0),
      daysLogged: financeLogs.length,
      avgDailyExpense: financeLogs.length > 0
        ? financeLogs.reduce((sum, log) => sum + log.totalExpense, 0) / financeLogs.length
        : 0
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/finance/:id/budget
// @desc    Update budget
// @access  Private
router.put('/:id/budget', protect, async (req, res) => {
  try {
    const financeLog = await FinanceLog.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (financeLog) {
      if (req.body.dailyBudget) financeLog.dailyBudget = req.body.dailyBudget;
      if (req.body.monthlyBudget) financeLog.monthlyBudget = req.body.monthlyBudget;
      
      const updatedLog = await financeLog.save();
      res.json(updatedLog);
    } else {
      res.status(404).json({ message: 'Finance log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



