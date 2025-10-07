import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getWorkouts, createWorkout, getWeeklyWorkoutStats } from '../utils/api';
import { format, subDays } from 'date-fns';
import WorkoutSplit from '../components/WorkoutSplit';
import WeeklyWorkoutTracker from '../components/WeeklyWorkoutTracker';

const Fitness = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    split: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }],
    duration: '',
    weight: '',
    calories: '',
    protein: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const today = new Date();
      const weekAgo = subDays(today, 7);
      
      const [workoutsRes, statsRes] = await Promise.all([
        getWorkouts(weekAgo.toISOString(), today.toISOString()),
        getWeeklyWorkoutStats()
      ]);
      
      setWorkouts(workoutsRes.data);
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
      await createWorkout({
        ...formData,
        exercises: formData.exercises.filter(ex => ex.name),
        date: new Date()
      });
      setShowModal(false);
      setFormData({
        split: '',
        exercises: [{ name: '', sets: '', reps: '', weight: '' }],
        duration: '',
        weight: '',
        calories: '',
        protein: '',
        notes: ''
      });
      fetchData();
    } catch (error) {
      console.error('Failed to create workout:', error);
    }
  };

  const handleSelectSplit = (splitName) => {
    setFormData({ ...formData, split: splitName });
    setShowModal(true);
  };


  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', weight: '' }]
    });
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...formData.exercises];
    newExercises[index][field] = value;
    setFormData({ ...formData, exercises: newExercises });
  };

  const chartData = workouts.map(w => ({
    date: format(new Date(w.date), 'MMM dd'),
    duration: w.duration,
    calories: w.calories || 0
  }));

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
        <h1 className="text-3xl font-bold text-dark-700">💪 Fitness Tracker</h1>
        <p className="text-dark-400 mt-1">Track your workouts and progress</p>
      </div>

      {/* Winter Arc 6-Day Split */}
      <WorkoutSplit onSelectSplit={handleSelectSplit} />

      {/* Weekly Workout Tracker */}
      <WeeklyWorkoutTracker />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <TrendingUp className="text-primary-500 w-8 h-8 mb-2" />
            <p className="text-2xl font-bold text-dark-700">{stats.totalWorkouts}</p>
            <p className="text-sm text-dark-400">Workouts This Week</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <p className="text-2xl font-bold text-dark-700">{stats.totalDuration} min</p>
            <p className="text-sm text-dark-400">Total Duration</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <p className="text-2xl font-bold text-dark-700">{Math.round(stats.averageCalories)}</p>
            <p className="text-sm text-dark-400">Avg Calories/Day</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <p className="text-2xl font-bold text-dark-700">{Math.round(stats.averageProtein)}g</p>
            <p className="text-sm text-dark-400">Avg Protein/Day</p>
          </motion.div>
        </div>
      )}


      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Frequency Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-dark-700 mb-4">📊 Workout Frequency</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="date" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#27272a', 
                    border: '1px solid #3f3f46',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="duration" fill="#0ea5e9" name="Duration (min)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Progress Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-dark-700 mb-4">📈 Progress Trends</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-dark-700 font-medium">Workout Streak</span>
              </div>
              <span className="text-green-500 font-bold text-xl">{Math.min(workouts.length, 7)} days</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-dark-700 font-medium">Avg Duration</span>
              </div>
              <span className="text-blue-500 font-bold text-xl">
                {workouts.length > 0 ? Math.round(workouts.reduce((acc, w) => acc + w.duration, 0) / workouts.length) : 0} min
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-dark-700 font-medium">Total Volume</span>
              </div>
              <span className="text-purple-500 font-bold text-xl">
                {workouts.reduce((acc, w) => acc + w.duration, 0)} min
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-dark-700 font-medium">Calories Burned</span>
              </div>
              <span className="text-orange-500 font-bold text-xl">
                {workouts.reduce((acc, w) => acc + (w.calories || 0), 0)} cal
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Split Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold text-dark-700 mb-4">🎯 Split Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="font-bold text-dark-700 mb-1">Chest & Triceps</h3>
            <p className="text-orange-500 font-bold text-2xl">
              {workouts.filter(w => w.split?.includes('Chest')).length}
            </p>
            <p className="text-xs text-dark-400">Workouts this week</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-3xl mb-2">🦾</div>
            <h3 className="font-bold text-dark-700 mb-1">Back & Biceps</h3>
            <p className="text-blue-500 font-bold text-2xl">
              {workouts.filter(w => w.split?.includes('Back')).length}
            </p>
            <p className="text-xs text-dark-400">Workouts this week</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="text-3xl mb-2">🏋️</div>
            <h3 className="font-bold text-dark-700 mb-1">Shoulders & Legs</h3>
            <p className="text-purple-500 font-bold text-2xl">
              {workouts.filter(w => w.split?.includes('Shoulders')).length}
            </p>
            <p className="text-xs text-dark-400">Workouts this week</p>
          </div>
        </div>
      </motion.div>

      {/* Add Workout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-dark-700 mb-4">Log Workout</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Workout Split */}
              {formData.split && (
                <div className="glass-card p-4 bg-primary-500/10 border-2 border-primary-500">
                  <p className="text-sm text-dark-400 mb-1">Today's Focus</p>
                  <p className="text-lg font-bold text-primary-500">{formData.split}</p>
                </div>
              )}

              {/* Exercises */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-dark-600">Exercises</label>
                  <button type="button" onClick={addExercise} className="text-primary-500 text-sm font-medium">
                    + Add Exercise
                  </button>
                </div>
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Exercise"
                      value={exercise.name}
                      onChange={(e) => updateExercise(index, 'name', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Sets"
                      value={exercise.sets}
                      onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={exercise.reps}
                      onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={exercise.weight}
                      onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                      className="input-field"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Duration (min)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Body Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Calories</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({...formData, calories: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({...formData, protein: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-600 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  Save Workout
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

export default Fitness;

