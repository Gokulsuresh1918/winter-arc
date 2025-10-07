import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'salary',
      'freelance',
      'investment',
      'other-income',
      'food',
      'transport',
      'shopping',
      'bills',
      'health',
      'entertainment',
      'education',
      'gym',
      'other-expense'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const financeLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  transactions: [transactionSchema],
  dailyBudget: {
    type: Number,
    default: 1000
  },
  monthlyBudget: {
    type: Number,
    default: 30000
  },
  totalIncome: {
    type: Number,
    default: 0
  },
  totalExpense: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
financeLogSchema.pre('save', function(next) {
  this.totalIncome = this.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  this.totalExpense = this.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  this.balance = this.totalIncome - this.totalExpense;
  
  next();
});

const FinanceLog = mongoose.model('FinanceLog', financeLogSchema);

export default FinanceLog;



