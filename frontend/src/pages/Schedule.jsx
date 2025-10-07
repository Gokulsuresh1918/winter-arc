import { useState } from 'react';
import { motion } from 'framer-motion';
import DailyScheduleTracker from '../components/DailyScheduleTracker';
import MorningCheckIn from '../components/MorningCheckIn';
import PomodoroTimer from '../components/PomodoroTimer';
import { updateMorningCheckIn, getTodaySchedule, logPomodoroSession } from '../utils/api';

const Schedule = () => {
  const [showMorningCheckIn, setShowMorningCheckIn] = useState(false);
  const [scheduleKey, setScheduleKey] = useState(0);

  const handleMorningCheckIn = async (data) => {
    try {
      const schedule = await getTodaySchedule();
      await updateMorningCheckIn(schedule.data._id, data);
      setShowMorningCheckIn(false);
      setScheduleKey(prev => prev + 1); // Refresh schedule
    } catch (error) {
      console.error('Failed to complete morning check-in:', error);
    }
  };

  const handlePomodoroComplete = async (session) => {
    try {
      const schedule = await getTodaySchedule();
      await logPomodoroSession(schedule.data._id, session);
      setScheduleKey(prev => prev + 1); // Refresh schedule
    } catch (error) {
      console.error('Failed to log pomodoro:', error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-2">
          Daily Schedule 📅
        </h1>
        <p className="text-dark-400">
          Stay organized and productive with your personalized schedule
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schedule - Takes 2 columns */}
        <div className="lg:col-span-2">
          <DailyScheduleTracker 
            key={scheduleKey}
            onMorningCheckIn={() => setShowMorningCheckIn(true)}
          />
        </div>

        {/* Pomodoro Timer - Takes 1 column */}
        <div>
          <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
        </div>
      </div>

      {/* Morning Check-In Modal */}
      {showMorningCheckIn && (
        <MorningCheckIn
          onComplete={handleMorningCheckIn}
          onClose={() => setShowMorningCheckIn(false)}
        />
      )}
    </div>
  );
};

export default Schedule;


