import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Circle, AlertCircle, TrendingUp, Coffee } from 'lucide-react';
import { getTodaySchedule, updateScheduleActivity } from '../utils/api';

const DailyScheduleTracker = ({ onMorningCheckIn }) => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchSchedule();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const fetchSchedule = async () => {
    try {
      const { data } = await getTodaySchedule();
      setSchedule(data);
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActivity = async (activityId, completed) => {
    try {
      const { data } = await updateScheduleActivity(schedule._id, activityId, { 
        completed,
        completedAt: completed ? new Date() : null
      });
      setSchedule(data);
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  };

  const getCurrentActivity = () => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    const timeRanges = {
      'Morning Check-In': { start: 330, end: 360 }, // 5:30-6:00
      'Gym': { start: 360, end: 450 }, // 6:00-7:30
      'Breakfast & Get Ready': { start: 480, end: 540 }, // 8:00-9:00
      'Office Work': { start: 540, end: 1080 }, // 9:00-18:00 (6 PM)
      'Lunch Break': { start: 750, end: 810 }, // 12:30-13:30
      'Travel / Rest': { start: 1020, end: 1170 }, // 17:00-19:30 (5 PM - 7:30 PM)
      'Family / Entertainment': { start: 1200, end: 1260 }, // 20:00-21:00 (8 PM - 9 PM)
      'Study & Growth': { start: 1260, end: 1440 }, // 21:00-24:00 (9 PM - 12 AM)
      'Sleep': { start: 30, end: 330 } // 12:30 AM - 5:30 AM
    };

    for (const [activity, range] of Object.entries(timeRanges)) {
      if (activity === 'Sleep') {
        if (timeInMinutes >= range.start || timeInMinutes < range.end) {
          return activity;
        }
      } else if (timeInMinutes >= range.start && timeInMinutes < range.end) {
        return activity;
      }
    }

    return null;
  };

  const currentActivity = getCurrentActivity();

  const getActivityIcon = (activity) => {
    const icons = {
      'Morning Check-In': '🌅',
      'Gym': '💪',
      'Breakfast & Get Ready': '🍳',
      'Office Work': '💻',
      'Lunch Break': '🍽️',
      'Travel / Rest': '🚗',
      'Family / Entertainment': '👨‍👩‍👧',
      'Study & Growth': '📚',
      'Sleep': '😴'
    };
    return icons[activity] || '⏰';
  };

  const getActivityColor = (activity) => {
    const colors = {
      'Morning Check-In': 'orange',
      'Gym': 'red',
      'Breakfast & Get Ready': 'yellow',
      'Office Work': 'blue',
      'Lunch Break': 'green',
      'Travel / Rest': 'purple',
      'Family / Entertainment': 'pink',
      'Study & Growth': 'indigo',
      'Sleep': 'gray'
    };
    return colors[activity] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!schedule) return null;

  const completionRate = schedule.completionRate || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-dark-700 mb-1">📅 Daily Schedule</h3>
          <p className="text-sm text-dark-400">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary-500">{completionRate}%</p>
          <p className="text-xs text-dark-400">Completed</p>
        </div>
      </div>

      {/* Current Activity Banner */}
      {currentActivity && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getActivityIcon(currentActivity)}</div>
            <div className="flex-1">
              <p className="text-sm opacity-90">Current Activity</p>
              <p className="text-lg font-bold">{currentActivity}</p>
            </div>
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
        </motion.div>
      )}

      {/* Morning Check-In Alert */}
      {!schedule.morningCheckIn?.completed && currentTime.getHours() >= 5 && currentTime.getHours() < 12 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-lg bg-orange-500/20 border-2 border-orange-500"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="text-orange-500 w-6 h-6" />
              <div>
                <p className="font-semibold text-dark-700">Complete Morning Check-In</p>
                <p className="text-sm text-dark-400">Rate your sleep & set intentions</p>
              </div>
            </div>
            <button
              onClick={onMorningCheckIn}
              className="btn-primary"
            >
              Start
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-dark-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              completionRate === 100
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : 'bg-gradient-to-r from-primary-600 to-primary-400'
            }`}
          />
        </div>
      </div>

      {/* Schedule Activities */}
      <div className="space-y-3">
        {schedule.activities.map((activity, index) => {
          const isCompleted = activity.completed;
          const isCurrent = activity.activity === currentActivity;
          const color = getActivityColor(activity.activity);

          return (
            <motion.button
              key={activity._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleActivity(activity._id, !isCompleted)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isCurrent
                  ? `border-${color}-500 bg-${color}-500/20 shadow-lg`
                  : isCompleted
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-dark-200 hover:border-dark-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${isCurrent ? 'animate-bounce' : ''}`}>
                  {getActivityIcon(activity.activity)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-xs font-semibold ${
                      isCurrent ? `text-${color}-600` : 'text-dark-400'
                    }`}>
                      {activity.time}
                    </p>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs font-bold animate-pulse">
                        NOW
                      </span>
                    )}
                  </div>
                  <p className={`font-semibold ${
                    isCompleted ? 'text-dark-600 line-through' : 'text-dark-700'
                  }`}>
                    {activity.activity}
                  </p>
                  <p className="text-xs text-dark-400 mt-1">{activity.details}</p>
                </div>

                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'border-green-500 bg-green-500'
                    : 'border-dark-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-dark-300" />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Completion Message */}
      {completionRate === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-lg text-center font-semibold bg-green-500/20 text-green-600 border-2 border-green-500"
        >
          <span className="text-3xl mr-2">🎉</span>
          Perfect Day Completed! You're unstoppable! 🔥
          <span className="text-3xl ml-2">🎉</span>
        </motion.div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <Clock className="text-primary-500 w-5 h-5 mx-auto mb-1" />
          <p className="text-lg font-bold text-dark-700">
            {schedule.activities.filter(a => a.completed).length}/{schedule.activities.length}
          </p>
          <p className="text-xs text-dark-400">Activities</p>
        </div>
        <div className="glass-card p-3 text-center">
          <TrendingUp className="text-green-500 w-5 h-5 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-500">{schedule.totalPomodoros || 0}</p>
          <p className="text-xs text-dark-400">Pomodoros</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-orange-500">{Math.round((schedule.totalFocusTime || 0) / 60)}h</p>
          <p className="text-xs text-dark-400">Focus Time</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyScheduleTracker;



