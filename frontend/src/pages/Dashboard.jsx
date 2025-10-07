import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sunrise, Moon, CheckCircle, Flame } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import PersonalCareTracker from '../components/PersonalCareTracker';
import MoneyTracker from '../components/MoneyTracker';
import BodyWeightTracker from '../components/BodyWeightTracker';
import { getDayLogToday, updateDayLog, getStreak, getDailyQuote } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [dayLog, setDayLog] = useState(null);
  const [streak, setStreak] = useState(0);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = currentHour < 18 ? Sunrise : Moon;
  const GreetingIcon = greetingIcon;

  useEffect(() => {
    fetchData();
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const { data } = await getDailyQuote();
      setQuote(data.quote);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
    }
  };

  const fetchData = async () => {
    try {
      const [dayLogRes, streakRes] = await Promise.all([
        getDayLogToday(),
        getStreak()
      ]);
      setDayLog(dayLogRes.data);
      setStreak(streakRes.data.streak);
      setRating(dayLogRes.data.rating || 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskName, status) => {
    try {
      const updatedTasks = {
        ...dayLog.tasks,
        [taskName]: {
          ...dayLog.tasks[taskName],
          status
        }
      };

      const { data } = await updateDayLog(dayLog._id, { tasks: updatedTasks });
      setDayLog(data);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleRatingChange = async (newRating) => {
    try {
      setRating(newRating);
      await updateDayLog(dayLog._id, { rating: newRating });
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  const handlePersonalCareUpdate = async (routineType, updatedRoutine) => {
    try {
      const updateData = routineType === 'morning' 
        ? { morningRoutine: updatedRoutine }
        : { eveningRoutine: updatedRoutine };
      
      const { data } = await updateDayLog(dayLog._id, updateData);
      setDayLog(data);
    } catch (error) {
      console.error('Failed to update personal care:', error);
    }
  };

  const tasks = dayLog ? [
    { name: 'meditation', ...dayLog.tasks.meditation },
    { name: 'gym', ...dayLog.tasks.gym },
    { name: 'study', ...dayLog.tasks.study },
    { name: 'journal', ...dayLog.tasks.journal },
    { name: 'reading', ...dayLog.tasks.reading }
  ] : [];

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GreetingIcon className="text-primary-500 w-8 h-8" />
              <h1 className="text-3xl font-bold text-dark-700">
                {greeting}, {user?.name}! 🌅
              </h1>
            </div>
            <p className="text-dark-400">
              Day {streak + 1} of Difference. Keep pushing forward!
            </p>
            {quote && (
              <div className="mt-4 p-4 rounded-lg bg-primary-500/10 border-l-4 border-primary-500">
                <p className="text-sm text-dark-600 italic">
                  "{quote}"
                </p>
              </div>
            )}
          </div>
          
          <div className="text-center glass-card p-4">
            <Flame className="w-12 h-12 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-orange-500">{streak}</p>
            <p className="text-sm text-dark-400">Day Streak</p>
          </div>
        </div>
      </motion.div>


      {/* Personal Care Tracker */}
      {dayLog && (
        <PersonalCareTracker
          morningRoutine={dayLog.morningRoutine || {
            brushTeeth: false,
            skincare: false,
            moisturizer: false,
            sunscreen: false
          }}
          eveningRoutine={dayLog.eveningRoutine || {
            brushTeeth: false,
            skincare: false,
            underEyeCream: false,
            moisturizer: false
          }}
          onUpdate={handlePersonalCareUpdate}
        />
      )}

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold text-dark-700 mb-4">Today's Progress</h2>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-dark-600">Daily Completion</span>
            <span className="text-sm font-semibold text-primary-500">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-dark-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-dark-400">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {completedTasks} of {tasks.length} completed
          </span>
        </div>
      </motion.div>

      {/* Daily Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-dark-700 mb-4">Daily Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <motion.div
              key={task.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <TaskCard
                task={task}
                onStatusChange={(status) => handleTaskStatusChange(task.name, status)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Money & Body Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoneyTracker />
        <BodyWeightTracker />
      </div>

      {/* Day Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold text-dark-700 mb-4">Rate Your Day</h2>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`text-4xl transition-all hover:scale-110 ${
                star <= rating ? 'text-yellow-500' : 'text-dark-300'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-dark-400 mt-2">
            {rating === 5 && '🔥 Legendary day! You crushed it!'}
            {rating === 4 && '💪 Great work today!'}
            {rating === 3 && '👍 Solid progress!'}
            {rating === 2 && '📈 Room for improvement!'}
            {rating === 1 && '🌱 Tomorrow is a new day!'}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;

