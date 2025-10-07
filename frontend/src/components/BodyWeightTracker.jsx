import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, TrendingUp, TrendingDown, Activity, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getLatestBodyMetrics, logBodyMetrics, getWeightProgress } from '../utils/api';
import { format } from 'date-fns';

const BodyWeightTracker = () => {
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [metricsForm, setMetricsForm] = useState({
    weight: '',
    height: '',
    bodyFat: '',
    muscleMass: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [latestRes, progressRes] = await Promise.all([
        getLatestBodyMetrics(),
        getWeightProgress()
      ]);
      
      setLatestMetrics(latestRes.data);
      setProgressData(progressRes.data);
      
      if (latestRes.data) {
        setMetricsForm({
          weight: latestRes.data.weight,
          height: latestRes.data.height,
          bodyFat: latestRes.data.bodyFat || '',
          muscleMass: latestRes.data.muscleMass || '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch body metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logBodyMetrics({
        ...metricsForm,
        weight: parseFloat(metricsForm.weight),
        height: parseFloat(metricsForm.height),
        bodyFat: metricsForm.bodyFat ? parseFloat(metricsForm.bodyFat) : undefined,
        muscleMass: metricsForm.muscleMass ? parseFloat(metricsForm.muscleMass) : undefined
      });
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to log metrics:', error);
    }
  };

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 25) return 'text-green-500';
    if (bmi < 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getBMICategory = (category) => {
    const colors = {
      'Underweight': 'bg-blue-500/20 text-blue-500 border-blue-500',
      'Normal': 'bg-green-500/20 text-green-500 border-green-500',
      'Overweight': 'bg-orange-500/20 text-orange-500 border-orange-500',
      'Obese': 'bg-red-500/20 text-red-500 border-red-500'
    };
    return colors[category] || colors['Normal'];
  };

  const calculateWeightChange = () => {
    if (progressData.length < 2) return null;
    const latest = progressData[progressData.length - 1].weight;
    const previous = progressData[progressData.length - 2].weight;
    return latest - previous;
  };

  const weightChange = calculateWeightChange();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-dark-700 mb-1">⚖️ Body Weight & BMI</h3>
            <p className="text-sm text-dark-400">Track your body composition</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Log
          </button>
        </div>

        {latestMetrics ? (
          <>
            {/* Current Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4 text-center border-2 border-primary-500">
                <Scale className="text-primary-500 w-6 h-6 mx-auto mb-2" />
                <p className="text-3xl font-bold text-dark-700">{latestMetrics.weight}</p>
                <p className="text-xs text-dark-400">kg</p>
              </div>
              
              <div className={`glass-card p-4 text-center border-2 ${getBMICategory(latestMetrics.bmiCategory)}`}>
                <Activity className="w-6 h-6 mx-auto mb-2" />
                <p className={`text-3xl font-bold ${getBMIColor(latestMetrics.bmi)}`}>{latestMetrics.bmi}</p>
                <p className="text-xs">BMI</p>
              </div>
              
              {latestMetrics.bodyFat && (
                <div className="glass-card p-4 text-center border-2 border-orange-500">
                  <p className="text-3xl font-bold text-orange-500">{latestMetrics.bodyFat}%</p>
                  <p className="text-xs text-dark-400">Body Fat</p>
                </div>
              )}
              
              {latestMetrics.muscleMass && (
                <div className="glass-card p-4 text-center border-2 border-purple-500">
                  <p className="text-3xl font-bold text-purple-500">{latestMetrics.muscleMass}</p>
                  <p className="text-xs text-dark-400">Muscle (kg)</p>
                </div>
              )}
            </div>

            {/* BMI Category Badge */}
            <div className={`glass-card p-4 text-center border-2 ${getBMICategory(latestMetrics.bmiCategory)} mb-6`}>
              <p className="text-lg font-bold">
                BMI Category: {latestMetrics.bmiCategory}
              </p>
              <p className="text-xs mt-1 opacity-75">
                {latestMetrics.bmiCategory === 'Normal' && 'Perfect! Keep maintaining 💪'}
                {latestMetrics.bmiCategory === 'Underweight' && 'Focus on gaining healthy weight 🍗'}
                {latestMetrics.bmiCategory === 'Overweight' && 'Time to cut! You got this 💪'}
                {latestMetrics.bmiCategory === 'Obese' && 'Let\'s work on your health together 🏃'}
              </p>
            </div>

            {/* Weight Change */}
            {weightChange !== null && (
              <div className={`glass-card p-4 flex items-center justify-center gap-2 mb-6 ${
                weightChange > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'
              }`}>
                {weightChange > 0 ? (
                  <TrendingUp className="text-orange-500 w-5 h-5" />
                ) : (
                  <TrendingDown className="text-green-500 w-5 h-5" />
                )}
                <p className={`font-semibold ${
                  weightChange > 0 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg since last log
                </p>
              </div>
            )}

            {/* Progress Chart */}
            {progressData.length > 1 && (
              <div className="glass-card p-4">
                <h4 className="text-sm font-semibold text-dark-600 mb-3">📈 Weight Progress</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#a1a1aa"
                      tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                    />
                    <YAxis stroke="#a1a1aa" domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#27272a', 
                        border: '1px solid #3f3f46',
                        borderRadius: '8px'
                      }}
                      labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      dot={{ fill: '#0ea5e9', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* BMI Reference */}
            <div className="glass-card p-4 mt-4">
              <h4 className="text-sm font-semibold text-dark-600 mb-3">📊 BMI Reference</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-500">Underweight</span>
                  <span className="text-dark-400">&lt; 18.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-500">Normal</span>
                  <span className="text-dark-400">18.5 - 24.9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-500">Overweight</span>
                  <span className="text-dark-400">25 - 29.9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-500">Obese</span>
                  <span className="text-dark-400">≥ 30</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Scale className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-400 mb-4">No metrics logged yet</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Log Your First Entry
            </button>
          </div>
        )}
      </motion.div>

      {/* Log Metrics Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-dark-700 mb-4">Log Body Metrics</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={metricsForm.weight}
                    onChange={(e) => setMetricsForm({...metricsForm, weight: e.target.value})}
                    className="input-field"
                    placeholder="70.5"
                  />
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Height (cm) *</label>
                  <input
                    type="number"
                    required
                    value={metricsForm.height}
                    onChange={(e) => setMetricsForm({...metricsForm, height: e.target.value})}
                    className="input-field"
                    placeholder="175"
                  />
                  <p className="text-xs text-dark-400 mt-1">BMI will be calculated automatically</p>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-600 mb-2">Body Fat (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={metricsForm.bodyFat}
                      onChange={(e) => setMetricsForm({...metricsForm, bodyFat: e.target.value})}
                      className="input-field"
                      placeholder="15.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark-600 mb-2">Muscle (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={metricsForm.muscleMass}
                      onChange={(e) => setMetricsForm({...metricsForm, muscleMass: e.target.value})}
                      className="input-field"
                      placeholder="50.0"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-dark-600 mb-2">Notes</label>
                  <textarea
                    value={metricsForm.notes}
                    onChange={(e) => setMetricsForm({...metricsForm, notes: e.target.value})}
                    className="input-field"
                    rows="2"
                    placeholder="Feeling lean today..."
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">
                    Log Metrics
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyWeightTracker;



