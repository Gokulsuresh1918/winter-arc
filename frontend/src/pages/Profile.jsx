import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Target, Clock, Award, Edit2, Save } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../utils/api';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    wakeTime: '',
    sleepTime: '',
    focusQuote: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getUserProfile();
      setUser(data);
      setFormData({
        name: data.name,
        goal: data.goal,
        wakeTime: data.wakeTime,
        sleepTime: data.sleepTime,
        focusQuote: data.focusQuote
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateUserProfile(formData);
      setUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
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
        <h1 className="text-3xl font-bold text-dark-700">👤 Profile</h1>
        <p className="text-dark-400 mt-1">Manage your account and goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <User className="text-primary-500 w-8 h-8" />
              <h2 className="text-2xl font-bold text-dark-700">Personal Information</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Goal</label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Wake Time</label>
                  <input
                    type="time"
                    value={formData.wakeTime}
                    onChange={(e) => setFormData({...formData, wakeTime: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Sleep Time</label>
                  <input
                    type="time"
                    value={formData.sleepTime}
                    onChange={(e) => setFormData({...formData, sleepTime: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Focus Quote</label>
                <textarea
                  value={formData.focusQuote}
                  onChange={(e) => setFormData({...formData, focusQuote: e.target.value})}
                  className="input-field"
                  rows="2"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark-400">Name</p>
                <p className="text-lg font-semibold text-dark-700">{user?.name}</p>
              </div>

              <div>
                <p className="text-sm text-dark-400">Email</p>
                <p className="text-lg font-semibold text-dark-700">{authUser?.email}</p>
              </div>

              <div>
                <p className="text-sm text-dark-400">Goal</p>
                <p className="text-lg font-semibold text-dark-700">{user?.goal}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-dark-400">Wake Time</p>
                  <p className="text-lg font-semibold text-dark-700">{user?.wakeTime}</p>
                </div>
                <div>
                  <p className="text-sm text-dark-400">Sleep Time</p>
                  <p className="text-lg font-semibold text-dark-700">{user?.sleepTime}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-dark-400">Focus Quote</p>
                <p className="text-lg italic text-dark-700">"{user?.focusQuote}"</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="glass-card p-6">
            <Target className="text-orange-500 w-8 h-8 mb-3" />
            <p className="text-3xl font-bold text-dark-700">{user?.currentStreak || 0}</p>
            <p className="text-sm text-dark-400">Current Streak</p>
          </div>

          <div className="glass-card p-6">
            <Clock className="text-primary-500 w-8 h-8 mb-3" />
            <p className="text-3xl font-bold text-dark-700">{user?.longestStreak || 0}</p>
            <p className="text-sm text-dark-400">Longest Streak</p>
          </div>

          <div className="glass-card p-6">
            <Award className="text-yellow-500 w-8 h-8 mb-3" />
            <p className="text-3xl font-bold text-dark-700">{user?.badges?.length || 0}</p>
            <p className="text-sm text-dark-400">Badges Earned</p>
          </div>
        </motion.div>
      </div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-yellow-500 w-8 h-8" />
          <h2 className="text-2xl font-bold text-dark-700">Achievements & Badges</h2>
        </div>

        {user?.badges && user.badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 text-center hover:shadow-glow-sm transition-all"
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-semibold text-dark-700">{badge.name}</p>
                <p className="text-xs text-dark-400 mt-1">
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-400">No badges earned yet. Keep pushing to unlock achievements!</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="glass-card p-4">
                <div className="text-2xl mb-2">🔥</div>
                <p className="font-semibold text-dark-700">Consistency King</p>
                <p className="text-sm text-dark-400">Complete 7 days in a row</p>
              </div>
              <div className="glass-card p-4">
                <div className="text-2xl mb-2">⚡</div>
                <p className="font-semibold text-dark-700">Focus Warrior</p>
                <p className="text-sm text-dark-400">Log 10+ study sessions</p>
              </div>
              <div className="glass-card p-4">
                <div className="text-2xl mb-2">🧘</div>
                <p className="font-semibold text-dark-700">Zen Mind</p>
                <p className="text-sm text-dark-400">Meditate 7 days straight</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Winter Arc Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <h2 className="text-2xl font-bold text-dark-700 mb-4">❄️ Winter Arc Journey</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-dark-600">Overall Progress</span>
              <span className="text-primary-500 font-semibold">Day {user?.currentStreak + 1}</span>
            </div>
            <div className="w-full bg-dark-200 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((user?.currentStreak || 0) / 90) * 100, 100)}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-primary-600 to-purple-500 rounded-full"
              />
            </div>
            <p className="text-sm text-dark-400 mt-2">
              {90 - (user?.currentStreak || 0)} days until Winter Arc completion
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

