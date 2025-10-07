import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Moon, Heart, Sunrise } from 'lucide-react';

const MorningCheckIn = ({ onComplete, onClose }) => {
  const [formData, setFormData] = useState({
    sleepQuality: 'good',
    sleepHours: 7,
    mood: 'good',
    reflection: '',
    gratitude: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const sleepQualities = [
    { value: 'excellent', label: 'Excellent', emoji: '😴', color: 'green' },
    { value: 'good', label: 'Good', emoji: '😊', color: 'blue' },
    { value: 'fair', label: 'Fair', emoji: '😐', color: 'yellow' },
    { value: 'poor', label: 'Poor', emoji: '😔', color: 'orange' },
    { value: 'terrible', label: 'Terrible', emoji: '😫', color: 'red' }
  ];

  const moods = [
    { value: 'energized', label: 'Energized', emoji: '⚡' },
    { value: 'good', label: 'Good', emoji: '😊' },
    { value: 'neutral', label: 'Neutral', emoji: '😐' },
    { value: 'tired', label: 'Tired', emoji: '😴' },
    { value: 'exhausted', label: 'Exhausted', emoji: '😩' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🌅</div>
          <h2 className="text-3xl font-bold text-dark-700 mb-2">Good Morning! ☀️</h2>
          <p className="text-dark-400">Start your day with intention</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sleep Quality */}
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-3">
              <Moon className="inline w-4 h-4 mr-2" />
              How was your sleep?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {sleepQualities.map(quality => (
                <button
                  key={quality.value}
                  type="button"
                  onClick={() => setFormData({...formData, sleepQuality: quality.value})}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.sleepQuality === quality.value
                      ? `border-${quality.color}-500 bg-${quality.color}-500/20`
                      : 'border-dark-200 hover:border-dark-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{quality.emoji}</div>
                  <p className="text-xs font-semibold">{quality.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Hours */}
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              Hours of Sleep
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={formData.sleepHours}
                onChange={(e) => setFormData({...formData, sleepHours: parseFloat(e.target.value)})}
                className="flex-1"
              />
              <div className="glass-card px-4 py-2 min-w-[80px] text-center">
                <p className="text-2xl font-bold text-primary-500">{formData.sleepHours}</p>
                <p className="text-xs text-dark-400">hours</p>
              </div>
            </div>
          </div>

          {/* Current Mood */}
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-3">
              <Sunrise className="inline w-4 h-4 mr-2" />
              How are you feeling?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moods.map(mood => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData({...formData, mood: mood.value})}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.mood === mood.value
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-dark-200 hover:border-dark-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <p className="text-xs font-semibold">{mood.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Morning Reflection */}
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Coffee className="inline w-4 h-4 mr-2" />
              Today's Intention (Optional)
            </label>
            <textarea
              value={formData.reflection}
              onChange={(e) => setFormData({...formData, reflection: e.target.value})}
              className="input-field"
              rows="3"
              placeholder="What do you want to accomplish today?"
            />
          </div>

          {/* Gratitude */}
          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">
              <Heart className="inline w-4 h-4 mr-2" />
              Gratitude (Optional)
            </label>
            <textarea
              value={formData.gratitude}
              onChange={(e) => setFormData({...formData, gratitude: e.target.value})}
              className="input-field"
              rows="2"
              placeholder="What are you grateful for?"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              Start My Day 🚀
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6"
            >
              Skip
            </button>
          </div>
        </form>

        {/* Motivational Quote */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-orange-500/20 to-primary-500/20 border-2 border-primary-500/30">
          <p className="text-sm text-dark-600 text-center italic">
            "The secret of getting ahead is getting started." - Mark Twain
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default MorningCheckIn;


