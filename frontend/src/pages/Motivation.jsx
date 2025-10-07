import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Target, Award, BookOpen, Dumbbell, Brain, PenLine, Book as BookIcon } from 'lucide-react';
import { getStreak, getWeeklyWorkoutStats, getStudyStatsByCategory, getCurrentBooks, getChallenges, getJournalEntries, getDailyQuote } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Motivation = () => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState({
    daily: 0,
    gym: 0,
    meditation: 0,
    reading: 0,
    journaling: 0,
    nofap: 0,
    detox: 0
  });
  const [stats, setStats] = useState(null);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        streakRes,
        workoutRes,
        studyRes,
        booksRes,
        challengesRes,
        journalRes,
        quoteRes
      ] = await Promise.all([
        getStreak(),
        getWeeklyWorkoutStats(),
        getStudyStatsByCategory(),
        getCurrentBooks(),
        getChallenges(),
        getJournalEntries(),
        getDailyQuote()
      ]);

      // Calculate streaks
      const dailyStreak = streakRes.data.streak;
      const gymStreak = calculateWorkoutStreak(workoutRes.data);
      const journalStreak = calculateJournalStreak(journalRes.data);
      const nofapChallenge = challengesRes.data.find(c => c.type === 'nofap' && c.status === 'active');
      const detoxChallenge = challengesRes.data.find(c => c.type === 'social-media-detox' && c.status === 'active');

      setStreaks({
        daily: dailyStreak,
        gym: gymStreak,
        meditation: dailyStreak, // Based on daily task completion
        reading: booksRes.data.length,
        journaling: journalStreak,
        nofap: nofapChallenge?.currentStreak || 0,
        detox: detoxChallenge?.currentStreak || 0
      });

      setStats({
        workouts: workoutRes.data.totalWorkouts,
        studySessions: Object.values(studyRes.data).reduce((sum, cat) => sum + cat.sessionCount, 0),
        booksReading: booksRes.data.length,
        activeChallenges: challengesRes.data.filter(c => c.status === 'active').length
      });

      setQuote(quoteRes.data.quote);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWorkoutStreak = (workoutStats) => {
    // Simplified - in real app would check consecutive days
    return workoutStats.totalWorkouts >= 3 ? Math.floor(workoutStats.totalWorkouts / 3) : 0;
  };

  const calculateJournalStreak = (entries) => {
    if (!entries || entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const StreakCard = ({ icon: Icon, label, streak, color, description }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`glass-card p-6 border-2 border-${color}-500 hover:shadow-glow-sm transition-all`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`text-${color}-500 w-8 h-8`} />
        <Flame className="text-orange-500 w-6 h-6" />
      </div>
      <div className="text-center">
        <p className={`text-4xl font-bold text-${color}-500 mb-1`}>{streak}</p>
        <p className="text-lg font-semibold text-dark-700">{label}</p>
        <p className="text-xs text-dark-400 mt-1">{description}</p>
      </div>
      {streak >= 7 && (
        <div className="mt-4 pt-4 border-t border-dark-200">
          <p className="text-xs text-center text-green-500 font-semibold">🏆 Week Streak!</p>
        </div>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const totalStreak = Object.values(streaks).reduce((sum, s) => sum + s, 0);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 bg-gradient-to-br from-primary-500/20 via-purple-500/10 to-orange-500/10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <Flame className="text-orange-500 w-24 h-24 mx-auto animate-pulse-slow" />
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-dark-700 mb-2">
            Welcome back, {user?.name}! 🌟
          </h1>
          <p className="text-xl text-dark-600 mb-4">
            You're on fire with a total of <span className="text-orange-500 font-bold">{totalStreak}</span> active streak days!
          </p>
          <div className="glass-card p-4 max-w-2xl mx-auto">
            <p className="text-lg text-dark-700 italic">"{quote}"</p>
          </div>
        </div>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-4">📊 This Week's Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-6 text-center">
            <Dumbbell className="text-primary-500 w-8 h-8 mx-auto mb-2" />
            <p className="text-3xl font-bold text-dark-700">{stats?.workouts || 0}</p>
            <p className="text-sm text-dark-400">Workouts</p>
          </div>
          <div className="glass-card p-6 text-center">
            <BookOpen className="text-green-500 w-8 h-8 mx-auto mb-2" />
            <p className="text-3xl font-bold text-dark-700">{stats?.studySessions || 0}</p>
            <p className="text-sm text-dark-400">Study Sessions</p>
          </div>
          <div className="glass-card p-6 text-center">
            <BookIcon className="text-purple-500 w-8 h-8 mx-auto mb-2" />
            <p className="text-3xl font-bold text-dark-700">{stats?.booksReading || 0}</p>
            <p className="text-sm text-dark-400">Books Reading</p>
          </div>
          <div className="glass-card p-6 text-center">
            <Target className="text-orange-500 w-8 h-8 mx-auto mb-2" />
            <p className="text-3xl font-bold text-dark-700">{stats?.activeChallenges || 0}</p>
            <p className="text-sm text-dark-400">Active Challenges</p>
          </div>
        </div>
      </motion.div>

      {/* All Streaks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-4">🔥 Your Streaks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StreakCard
            icon={TrendingUp}
            label="Daily Streak"
            streak={streaks.daily}
            color="primary"
            description="Overall consistency"
          />
          <StreakCard
            icon={Dumbbell}
            label="Gym Streak"
            streak={streaks.gym}
            color="orange"
            description="Workout consistency"
          />
          <StreakCard
            icon={Brain}
            label="Meditation Streak"
            streak={streaks.meditation}
            color="purple"
            description="Mindfulness practice"
          />
          <StreakCard
            icon={PenLine}
            label="Journal Streak"
            streak={streaks.journaling}
            color="green"
            description="Daily reflection"
          />
          <StreakCard
            icon={BookIcon}
            label="Reading Active"
            streak={streaks.reading}
            color="blue"
            description="Books in progress"
          />
          <StreakCard
            icon={Target}
            label="No-Fap"
            streak={streaks.nofap}
            color="orange"
            description="Self-discipline"
          />
          <StreakCard
            icon={Target}
            label="Social Detox"
            streak={streaks.detox}
            color="cyan"
            description="Digital wellness"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 border-2 border-yellow-500 hover:shadow-glow-sm transition-all flex items-center justify-center"
          >
            <div className="text-center">
              <Award className="text-yellow-500 w-12 h-12 mx-auto mb-2" />
              <p className="text-lg font-bold text-dark-700">Keep Going!</p>
              <p className="text-xs text-dark-400 mt-1">Every day counts</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Motivational Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 bg-gradient-to-r from-purple-500/10 to-primary-500/10"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-4 text-center">💪 Your Winter Arc Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-4xl mb-2">🎯</p>
            <p className="text-lg font-semibold text-dark-700">Stay Focused</p>
            <p className="text-sm text-dark-400">Your goals are within reach</p>
          </div>
          <div className="text-center">
            <p className="text-4xl mb-2">💎</p>
            <p className="text-lg font-semibold text-dark-700">Build Discipline</p>
            <p className="text-sm text-dark-400">Consistency is key</p>
          </div>
          <div className="text-center">
            <p className="text-4xl mb-2">👑</p>
            <p className="text-lg font-semibold text-dark-700">Become Legendary</p>
            <p className="text-sm text-dark-400">Transform into your best self</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg text-dark-600 italic">
            "Success is the sum of small efforts repeated day in and day out."
          </p>
          <p className="text-sm text-dark-400 mt-2">- Robert Collier</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Motivation;


