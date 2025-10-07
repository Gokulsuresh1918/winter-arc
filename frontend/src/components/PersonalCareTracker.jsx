import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Check } from 'lucide-react';

const PersonalCareTracker = ({ morningRoutine, eveningRoutine, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('morning');

  const morningItems = [
    { key: 'brushTeeth', label: 'Brush Teeth', icon: '🪥' },
    { key: 'skincare', label: 'Skincare', icon: '✨' },
    { key: 'moisturizer', label: 'Moisturizer', icon: '💧' },
    { key: 'sunscreen', label: 'Sunscreen', icon: '☀️' }
  ];

  const eveningItems = [
    { key: 'brushTeeth', label: 'Brush Teeth', icon: '🪥' },
    { key: 'skincare', label: 'Skincare', icon: '✨' },
    { key: 'underEyeCream', label: 'Under Eye Cream', icon: '👁️' },
    { key: 'moisturizer', label: 'Moisturizer', icon: '💧' }
  ];

  const handleToggle = (routineType, itemKey) => {
    const currentRoutine = routineType === 'morning' ? morningRoutine : eveningRoutine;
    const updatedRoutine = {
      ...currentRoutine,
      [itemKey]: !currentRoutine[itemKey]
    };
    onUpdate(routineType, updatedRoutine);
  };

  const calculateCompletion = (routine, itemCount) => {
    const completed = Object.values(routine).filter(Boolean).length;
    return Math.round((completed / itemCount) * 100);
  };

  const morningCompletion = calculateCompletion(morningRoutine, morningItems.length);
  const eveningCompletion = calculateCompletion(eveningRoutine, eveningItems.length);

  const items = activeTab === 'morning' ? morningItems : eveningItems;
  const routine = activeTab === 'morning' ? morningRoutine : eveningRoutine;
  const completion = activeTab === 'morning' ? morningCompletion : eveningCompletion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-dark-700 mb-2">🧴 Personal Care Routine</h3>
        <p className="text-sm text-dark-400">Track your daily skincare & hygiene</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'morning'
              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-glow-sm'
              : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
          }`}
        >
          <Sun className="w-5 h-5" />
          Morning
          {morningCompletion === 100 && <Check className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'evening'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-glow-sm'
              : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
          }`}
        >
          <Moon className="w-5 h-5" />
          Evening
          {eveningCompletion === 100 && <Check className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-dark-400">
            {activeTab === 'morning' ? 'Morning' : 'Evening'} Routine
          </span>
          <span className={`font-semibold ${
            completion === 100 ? 'text-green-500' : 'text-primary-500'
          }`}>
            {completion}%
          </span>
        </div>
        <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              completion === 100 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : activeTab === 'morning'
                ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                : 'bg-gradient-to-r from-purple-600 to-blue-600'
            }`}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isCompleted = routine[item.key];
          
          return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleToggle(activeTab, item.key)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isCompleted
                  ? activeTab === 'morning'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-purple-500 bg-purple-500/10'
                  : 'border-dark-200 hover:border-dark-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${isCompleted ? 'scale-110' : 'opacity-50'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      isCompleted ? 'text-dark-700' : 'text-dark-500'
                    }`}>
                      {item.label}
                    </p>
                  </div>
                </div>
                
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? activeTab === 'morning'
                      ? 'border-orange-500 bg-orange-500'
                      : 'border-purple-500 bg-purple-500'
                    : 'border-dark-300'
                }`}>
                  {isCompleted && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Completion Message */}
      {completion === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-4 p-4 rounded-lg text-center font-semibold ${
            activeTab === 'morning'
              ? 'bg-orange-500/20 text-orange-600'
              : 'bg-purple-500/20 text-purple-600'
          }`}
        >
          <span className="text-2xl mr-2">✨</span>
          {activeTab === 'morning' 
            ? "Morning routine complete! You're glowing! ☀️" 
            : "Evening routine complete! Sleep well! 🌙"}
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-dark-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sun className="text-orange-500 w-5 h-5" />
              <p className="text-2xl font-bold text-dark-700">{morningCompletion}%</p>
            </div>
            <p className="text-xs text-dark-400">Morning</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Moon className="text-purple-500 w-5 h-5" />
              <p className="text-2xl font-bold text-dark-700">{eveningCompletion}%</p>
            </div>
            <p className="text-xs text-dark-400">Evening</p>
          </div>
        </div>
      </div>

      {/* Streak Info */}
      {morningCompletion === 100 && eveningCompletion === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-primary-500/20 text-center"
        >
          <p className="text-sm font-semibold text-green-600">
            🎉 Perfect Day! Both routines complete!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PersonalCareTracker;

