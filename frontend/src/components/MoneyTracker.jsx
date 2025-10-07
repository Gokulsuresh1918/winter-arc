import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Plus, Trash2, DollarSign } from 'lucide-react';
import { getTodayFinanceLog, addTransaction, deleteTransaction, getMonthlyFinanceStats } from '../utils/api';

const MoneyTracker = () => {
  const [financeLog, setFinanceLog] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    category: 'food',
    amount: '',
    description: ''
  });

  const incomeCategories = [
    { value: 'salary', label: '💼 Salary', icon: '💼' },
    { value: 'freelance', label: '💻 Freelance', icon: '💻' },
    { value: 'investment', label: '📈 Investment', icon: '📈' },
    { value: 'other-income', label: '💰 Other', icon: '💰' }
  ];

  const expenseCategories = [
    { value: 'food', label: '🍽️ Food', icon: '🍽️' },
    { value: 'transport', label: '🚗 Transport', icon: '🚗' },
    { value: 'shopping', label: '🛍️ Shopping', icon: '🛍️' },
    { value: 'bills', label: '📱 Bills', icon: '📱' },
    { value: 'health', label: '⚕️ Health', icon: '⚕️' },
    { value: 'entertainment', label: '🎬 Entertainment', icon: '🎬' },
    { value: 'education', label: '📚 Education', icon: '📚' },
    { value: 'gym', label: '💪 Gym', icon: '💪' },
    { value: 'other-expense', label: '💸 Other', icon: '💸' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logRes, statsRes] = await Promise.all([
        getTodayFinanceLog(),
        getMonthlyFinanceStats()
      ]);
      
      setFinanceLog(logRes.data);
      setMonthlyStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await addTransaction(financeLog._id, transactionForm);
      setShowModal(false);
      setTransactionForm({
        type: 'expense',
        category: 'food',
        amount: '',
        description: ''
      });
      fetchData();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await deleteTransaction(financeLog._id, transactionId);
        fetchData();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  const getCategoryLabel = (category, type) => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    return categories.find(c => c.value === category)?.label || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const dailyExpensePercent = financeLog?.dailyBudget 
    ? Math.round((financeLog.totalExpense / financeLog.dailyBudget) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-dark-700 mb-1">💰 Money Tracker</h3>
            <p className="text-sm text-dark-400">Track your daily finances</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center border-2 border-green-500">
            <TrendingUp className="text-green-500 w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-500">₹{financeLog?.totalIncome || 0}</p>
            <p className="text-xs text-dark-400">Income</p>
          </div>
          
          <div className="glass-card p-4 text-center border-2 border-red-500">
            <TrendingDown className="text-red-500 w-6 h-6 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">₹{financeLog?.totalExpense || 0}</p>
            <p className="text-xs text-dark-400">Expense</p>
          </div>
          
          <div className={`glass-card p-4 text-center border-2 ${
            (financeLog?.balance || 0) >= 0 ? 'border-primary-500' : 'border-orange-500'
          }`}>
            <Wallet className={`w-6 h-6 mx-auto mb-2 ${
              (financeLog?.balance || 0) >= 0 ? 'text-primary-500' : 'text-orange-500'
            }`} />
            <p className={`text-2xl font-bold ${
              (financeLog?.balance || 0) >= 0 ? 'text-primary-500' : 'text-orange-500'
            }`}>
              ₹{financeLog?.balance || 0}
            </p>
            <p className="text-xs text-dark-400">Balance</p>
          </div>
        </div>

        {/* Daily Budget Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Daily Budget (₹{financeLog?.dailyBudget || 1000})</span>
            <span className={`font-semibold ${
              dailyExpensePercent > 100 ? 'text-red-500' : 'text-primary-500'
            }`}>
              {dailyExpensePercent}%
            </span>
          </div>
          <div className="w-full bg-dark-200 rounded-full h-3">
            <div
              className={`h-full rounded-full transition-all ${
                dailyExpensePercent > 100 
                  ? 'bg-red-500' 
                  : dailyExpensePercent > 80
                  ? 'bg-orange-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(dailyExpensePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Monthly Stats */}
        {monthlyStats && (
          <div className="glass-card p-4 bg-primary-500/10">
            <p className="text-sm text-dark-400 mb-2">📊 This Month</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-dark-400">Total Income</p>
                <p className="text-lg font-bold text-green-500">₹{monthlyStats.totalIncome}</p>
              </div>
              <div>
                <p className="text-dark-400">Total Expense</p>
                <p className="text-lg font-bold text-red-500">₹{monthlyStats.totalExpense}</p>
              </div>
              <div>
                <p className="text-dark-400">Net Balance</p>
                <p className={`text-lg font-bold ${
                  monthlyStats.balance >= 0 ? 'text-primary-500' : 'text-orange-500'
                }`}>
                  ₹{monthlyStats.balance}
                </p>
              </div>
              <div>
                <p className="text-dark-400">Avg Daily</p>
                <p className="text-lg font-bold text-dark-700">₹{Math.round(monthlyStats.avgDailyExpense)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Today's Transactions */}
        {financeLog && financeLog.transactions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-dark-600 mb-3">Today's Transactions</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {financeLog.transactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                    transaction.type === 'income' 
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="text-green-500 w-5 h-5" />
                      ) : (
                        <TrendingDown className="text-red-500 w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-dark-700">
                        {getCategoryLabel(transaction.category, transaction.type)}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-dark-400">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                    </p>
                    <button
                      onClick={() => handleDeleteTransaction(transaction._id)}
                      className="text-dark-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-dark-700 mb-4">Add Transaction</h3>
              
              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransactionForm({...transactionForm, type: 'income', category: 'salary'})}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        transactionForm.type === 'income'
                          ? 'bg-green-500 text-white'
                          : 'bg-dark-100 text-dark-600'
                      }`}
                    >
                      <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransactionForm({...transactionForm, type: 'expense', category: 'food'})}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        transactionForm.type === 'expense'
                          ? 'bg-red-500 text-white'
                          : 'bg-dark-100 text-dark-600'
                      }`}
                    >
                      <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                      Expense
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Category</label>
                  <select
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                    className="input-field"
                  >
                    {(transactionForm.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Amount (₹)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
                    <input
                      type="number"
                      required
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                      className="input-field pl-10"
                      placeholder="500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Description (Optional)</label>
                  <input
                    type="text"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                    className="input-field"
                    placeholder="Lunch at restaurant"
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    Add Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoneyTracker;



