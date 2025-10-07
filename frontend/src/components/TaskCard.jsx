import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, icon: Icon }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'skipped':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'skipped':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-dark-200 bg-dark-100';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-card p-4 border-2 transition-all ${getStatusColor()}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-6 h-6 text-primary-500" />}
          <h3 className="font-semibold text-dark-700 capitalize">{task.name}</h3>
        </div>
        {getStatusIcon()}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onStatusChange('completed')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            task.status === 'completed'
              ? 'bg-green-500 text-white'
              : 'bg-dark-100 text-dark-600 hover:bg-green-500/20'
          }`}
        >
          ✓ Done
        </button>
        <button
          onClick={() => onStatusChange('skipped')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            task.status === 'skipped'
              ? 'bg-red-500 text-white'
              : 'bg-dark-100 text-dark-600 hover:bg-red-500/20'
          }`}
        >
          ✕ Skip
        </button>
      </div>

      {task.duration > 0 && (
        <p className="text-xs text-dark-400 mt-2">
          Duration: {task.duration} min
        </p>
      )}
    </motion.div>
  );
};

export default TaskCard;

