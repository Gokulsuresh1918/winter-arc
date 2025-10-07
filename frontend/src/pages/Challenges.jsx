import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Smartphone, RotateCcw, TrendingUp, Award, Target } from 'lucide-react';
import { getActiveChallenge, createChallenge, resetChallenge, getMotivationalQuote, logChallengeProgress } from '../utils/api';
import { format, differenceInDays } from 'date-fns';

const Challenges = () => {
  const [nofapChallenge, setNofapChallenge] = useState(null);
  const [detoxChallenge, setDetoxChallenge] = useState(null);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedChallengeType, setSelectedChallengeType] = useState('');
  const [loading, setLoading] = useState(true);

  const milestones = [
    { days: 7, label: 'Week Warrior', icon: '🔥', color: 'orange' },
    { days: 14, label: '2 Week Champion', icon: '💪', color: 'yellow' },
    { days: 30, label: 'Month Master', icon: '⭐', color: 'blue' },
    { days: 60, label: '2 Month Hero', icon: '🏆', color: 'purple' },
    { days: 90, label: '90 Day Legend', icon: '👑', color: 'gold' },
    { days: 180, label: 'Half Year King', icon: '💎', color: 'cyan' },
    { days: 365, label: 'Year Champion', icon: '🌟', color: 'rainbow' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nofapRes, detoxRes, quoteRes] = await Promise.all([
        getActiveChallenge('nofap'),
        getActiveChallenge('social-media-detox'),
        getMotivationalQuote()
      ]);
      
      setNofapChallenge(nofapRes.data);
      setDetoxChallenge(detoxRes.data);
      setMotivationalQuote(quoteRes.data.quote);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChallenge = async (type) => {
    try {
      await createChallenge({
        type,
        name: type === 'nofap' ? 'No-Fap Challenge' : 'Social Media Detox'
      });
      setShowStartModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to start challenge:', error);
    }
  };

  const handleReset = async (challenge) => {
    if (window.confirm('Are you sure you want to reset this challenge? Your progress will be saved in history.')) {
      try {
        await resetChallenge(challenge._id, 'Manual reset');
        fetchData();
      } catch (error) {
        console.error('Failed to reset challenge:', error);
      }
    }
  };

  const ChallengeCard = ({ challenge, type, icon, title, color }) => {
    if (!challenge) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center"
        >
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-dark-700 mb-2">{title}</h3>
          <p className="text-dark-400 mb-6">Start your journey today</p>
          <button
            onClick={() => {
              setSelectedChallengeType(type);
              setShowStartModal(true);
            }}
            className="btn-primary"
          >
            Start Challenge
          </button>
        </motion.div>
      );
    }

    const currentStreak = challenge.currentStreak;
    const nextMilestone = milestones.find(m => m.days > currentStreak);
    const achievedMilestones = milestones.filter(m => m.days <= currentStreak);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card p-8 border-2 border-${color}-500`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-4xl mb-2">{icon}</div>
            <h3 className="text-2xl font-bold text-dark-700">{title}</h3>
            <p className="text-sm text-dark-400">
              Started {format(new Date(challenge.startDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <button
            onClick={() => handleReset(challenge)}
            className="text-red-400 hover:text-red-500 transition-colors"
            title="Reset Challenge"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Current Streak */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold text-${color}-500 mb-2`}>
            {currentStreak}
          </div>
          <p className="text-lg text-dark-600 font-semibold">
            {currentStreak === 1 ? 'Day' : 'Days'} Strong 🔥
          </p>
        </div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-dark-400">Next Milestone: {nextMilestone.label}</span>
              <span className={`text-${color}-500 font-semibold`}>
                {nextMilestone.days - currentStreak} days to go
              </span>
            </div>
            <div className="w-full bg-dark-200 rounded-full h-3">
              <div
                className={`h-full bg-gradient-to-r from-${color}-600 to-${color}-400 rounded-full transition-all`}
                style={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-3 text-center">
            <TrendingUp className={`text-${color}-500 w-6 h-6 mx-auto mb-1`} />
            <p className="text-xl font-bold text-dark-700">{challenge.currentStreak}</p>
            <p className="text-xs text-dark-400">Current</p>
          </div>
          <div className="glass-card p-3 text-center">
            <Award className="text-yellow-500 w-6 h-6 mx-auto mb-1" />
            <p className="text-xl font-bold text-dark-700">{challenge.longestStreak}</p>
            <p className="text-xs text-dark-400">Best</p>
          </div>
        </div>

        {/* Achieved Milestones */}
        {achievedMilestones.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-dark-600 mb-3">🏆 Unlocked Achievements</h4>
            <div className="grid grid-cols-3 gap-2">
              {achievedMilestones.map((milestone) => (
                <div
                  key={milestone.days}
                  className="glass-card p-2 text-center"
                  title={milestone.label}
                >
                  <div className="text-2xl">{milestone.icon}</div>
                  <p className="text-xs text-dark-400 mt-1">{milestone.days}d</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset History */}
        {challenge.resets && challenge.resets.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-200">
            <p className="text-xs text-dark-400">
              Resets: {challenge.resets.length} | Last: {format(new Date(challenge.resets[challenge.resets.length - 1].date), 'MMM dd')}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

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
      <div>
        <h1 className="text-3xl font-bold text-dark-700">🎯 Self-Discipline Challenges</h1>
        <p className="text-dark-400 mt-1">Build habits, break addictions, become unstoppable</p>
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 bg-gradient-to-r from-purple-500/10 to-primary-500/10"
      >
        <div className="flex items-center gap-4">
          <Target className="text-primary-500 w-10 h-10 flex-shrink-0" />
          <p className="text-lg text-dark-700 italic">"{motivationalQuote}"</p>
        </div>
      </motion.div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChallengeCard
          challenge={nofapChallenge}
          type="nofap"
          icon="🚫"
          title="No-Fap Challenge"
          color="orange"
        />
        
        <ChallengeCard
          challenge={detoxChallenge}
          type="social-media-detox"
          icon="📵"
          title="Social Media Detox"
          color="blue"
        />
      </div>

      {/* All Milestones Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-dark-700 mb-4">🏆 Milestone Roadmap</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.days}
              className="glass-card p-4 text-center hover:shadow-glow-sm transition-all"
            >
              <div className="text-3xl mb-2">{milestone.icon}</div>
              <p className="text-sm font-semibold text-dark-700">{milestone.days} Days</p>
              <p className="text-xs text-dark-400 mt-1">{milestone.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-dark-700 mb-4">💪 No-Fap Benefits</h3>
          <ul className="space-y-2 text-sm text-dark-600">
            <li>✅ Increased energy and motivation</li>
            <li>✅ Better focus and mental clarity</li>
            <li>✅ Improved self-discipline</li>
            <li>✅ Enhanced confidence</li>
            <li>✅ Better sleep quality</li>
            <li>✅ Stronger willpower</li>
          </ul>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-dark-700 mb-4">📱 Detox Tips</h3>
          <ul className="space-y-2 text-sm text-dark-600">
            <li>📵 Turn off non-essential notifications</li>
            <li>⏰ Set specific times for social media</li>
            <li>📚 Replace scrolling with reading</li>
            <li>🏃 Use saved time for exercise</li>
            <li>👥 Spend more time with real people</li>
            <li>🧘 Practice mindfulness instead</li>
          </ul>
        </div>
      </motion.div>

      {/* Start Challenge Modal */}
      <AnimatePresence>
        {showStartModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-8 w-full max-w-md text-center"
            >
              <div className="text-6xl mb-4">
                {selectedChallengeType === 'nofap' ? '🚫' : '📵'}
              </div>
              <h2 className="text-2xl font-bold text-dark-700 mb-2">
                Start Your Challenge?
              </h2>
              <p className="text-dark-400 mb-6">
                {selectedChallengeType === 'nofap' 
                  ? 'Begin your No-Fap journey. Build discipline, unlock your potential.'
                  : 'Start your Social Media Detox. Reclaim your time and focus.'}
              </p>
              <div className="glass-card p-4 mb-6 bg-primary-500/10">
                <p className="text-sm text-dark-600 italic">
                  "The only way to do great work is to love what you do and stay disciplined."
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleStartChallenge(selectedChallengeType)}
                  className="btn-primary flex-1"
                >
                  🔥 Let's Go!
                </button>
                <button
                  onClick={() => setShowStartModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Challenges;



