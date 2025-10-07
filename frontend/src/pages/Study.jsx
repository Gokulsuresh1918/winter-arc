import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getStudySessions, createStudySession, deleteStudySession, getStudyStatsByCategory } from '../utils/api';
import { format, subDays } from 'date-fns';
import ProgressBar from '../components/ProgressBar';
import PomodoroTimer from '../components/PomodoroTimer';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const CATEGORIES = [
  'Cloud & DevOps',
  'Software Architecture',
  'System Design',
  'Projects',
  'LeetCode',
  'Other'
];

const Study = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    topic: '',
    category: 'Cloud & DevOps',
    duration: '',
    completionPercentage: 0,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const today = new Date();
      const weekAgo = subDays(today, 7);
      
      const [sessionsRes, statsRes] = await Promise.all([
        getStudySessions(weekAgo.toISOString(), today.toISOString()),
        getStudyStatsByCategory()
      ]);
      
      setSessions(sessionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudySession({
        ...formData,
        date: new Date()
      });
      setShowModal(false);
      setFormData({
        topic: '',
        category: 'Cloud & DevOps',
        duration: '',
        completionPercentage: 0,
        notes: ''
      });
      fetchData();
    } catch (error) {
      console.error('Failed to create study session:', error);
    }
  };

  const handlePomodoroComplete = async (session) => {
    try {
      // Auto-create study session from pomodoro
      const studyData = {
        topic: session.task || 'Focus Session',
        category: 'Other', // Default category, user can change later
        duration: session.duration,
        completionPercentage: 100, // Pomodoro session is always 100% complete
        notes: `Pomodoro session completed - ${session.duration} minutes of focused study`,
        date: new Date()
      };
      
      await createStudySession(studyData);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Failed to log study session from pomodoro:', error);
    }
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm('Delete this study session?')) {
      try {
        await deleteStudySession(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const chartData = Object.keys(stats).map(category => ({
    name: category,
    value: stats[category].totalDuration,
    sessions: stats[category].sessionCount
  }));

  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-700">📚 Study Tracker</h1>
          <p className="text-dark-400 mt-1">Track your learning progress</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Log Session
        </button>
      </div>

      {/* Pomodoro Timer for Study */}
      <PomodoroTimer onSessionComplete={handlePomodoroComplete} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <BookOpen className="text-primary-500 w-8 h-8 mb-2" />
          <p className="text-2xl font-bold text-dark-700">{sessions.length}</p>
          <p className="text-sm text-dark-400">Sessions This Week</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <p className="text-2xl font-bold text-dark-700">{totalHours.toFixed(1)}h</p>
          <p className="text-sm text-dark-400">Total Study Time</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <p className="text-2xl font-bold text-dark-700">{Object.keys(stats).length}</p>
          <p className="text-sm text-dark-400">Active Categories</p>
        </motion.div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-dark-700 mb-4">Time by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#27272a', 
                    border: '1px solid #3f3f46',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-dark-700 mb-4">Category Progress</h2>
          <div className="space-y-4">
            {Object.keys(stats).map((category, index) => (
              <ProgressBar
                key={category}
                label={category}
                percentage={Math.round(stats[category].avgCompletion)}
                color={['primary', 'purple', 'green', 'orange'][index % 4]}
              />
            ))}
            {Object.keys(stats).length === 0 && (
              <p className="text-dark-400 text-center">No data yet. Start logging sessions!</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Session List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-dark-700 mb-4">Recent Sessions</h2>
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card p-6 hover:shadow-glow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-semibold text-primary-500 bg-primary-500/10 px-2 py-1 rounded">
                    {session.category}
                  </span>
                  <h3 className="text-lg font-semibold text-dark-700 mt-2">{session.topic}</h3>
                  <p className="text-sm text-dark-400 mt-1">
                    {format(new Date(session.date), 'MMMM dd, yyyy')} • {session.duration} min
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteSession(session._id)}
                  className="text-red-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-dark-400">Progress</span>
                  <span className="text-dark-700 font-semibold">{session.completionPercentage}%</span>
                </div>
                <div className="w-full bg-dark-200 rounded-full h-2">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${session.completionPercentage}%` }}
                  />
                </div>
              </div>

              {session.notes && (
                <p className="text-sm text-dark-400 italic">{session.notes}</p>
              )}
            </motion.div>
          ))}

          {sessions.length === 0 && (
            <div className="glass-card p-12 text-center">
              <p className="text-dark-400">No study sessions logged yet. Start tracking your learning!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold text-dark-700 mb-4">Log Study Session</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Topic</label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Docker Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input-field"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="input-field"
                  placeholder="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">
                  Completion: {formData.completionPercentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.completionPercentage}
                  onChange={(e) => setFormData({...formData, completionPercentage: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Key learnings, challenges faced..."
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Save Session
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Study;

