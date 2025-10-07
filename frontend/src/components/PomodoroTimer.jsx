import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Timer } from 'lucide-react';

const PomodoroTimer = ({ onSessionComplete }) => {
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [task, setTask] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const modes = {
    work: { duration: 25 * 60, label: 'Focus Time', icon: '🎯', color: 'primary' },
    shortBreak: { duration: 5 * 60, label: 'Short Break', icon: '☕', color: 'green' },
    longBreak: { duration: 15 * 60, label: 'Long Break', icon: '🌟', color: 'purple' }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Play notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Complete!', {
        body: mode === 'work' ? 'Time for a break!' : 'Back to work!',
        icon: '🍅'
      });
    }

    if (mode === 'work') {
      const session = {
        startTime: startTimeRef.current,
        endTime: new Date(),
        duration: modes.work.duration / 60,
        task: task || 'Focus session',
        completed: true,
        interrupted: false
      };
      
      onSessionComplete?.(session);
      
      setSessionsCompleted(prev => prev + 1);
      
      // Auto-switch to break
      if ((sessionsCompleted + 1) % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    if (!isRunning && timeLeft === modes[mode].duration) {
      startTimeRef.current = new Date();
      if (mode === 'work' && !task) {
        setShowTaskInput(true);
        return;
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  const startWithTask = () => {
    setShowTaskInput(false);
    startTimeRef.current = new Date();
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;
  const currentMode = modes[mode];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="text-center">
          {/* Header */}
          <div className="mb-4">
            <div className="text-4xl mb-2">{currentMode.icon}</div>
            <h3 className="text-xl font-bold text-dark-700">{currentMode.label}</h3>
            {mode === 'work' && task && (
              <p className="text-sm text-dark-400 mt-2">Task: {task}</p>
            )}
          </div>

          {/* Timer Circle */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                className="stroke-dark-200"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                className={`stroke-${currentMode.color}-500 transition-all duration-1000`}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-dark-700">{formatTime(timeLeft)}</p>
                {isRunning && (
                  <p className="text-sm text-dark-400 mt-2">Focus...</p>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`btn-${currentMode.color} w-16 h-16 rounded-full flex items-center justify-center`}
            >
              {isRunning ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
            <button
              onClick={resetTimer}
              className="btn-secondary w-12 h-12 rounded-full flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => switchMode('work')}
              disabled={isRunning}
              className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                mode === 'work'
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              <Zap className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Work</span>
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              disabled={isRunning}
              className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                mode === 'shortBreak'
                  ? 'bg-green-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              <Coffee className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Short</span>
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              disabled={isRunning}
              className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                mode === 'longBreak'
                  ? 'bg-purple-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              <Timer className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Long</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-dark-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-3">
                <p className="text-2xl font-bold text-primary-500">{sessionsCompleted}</p>
                <p className="text-xs text-dark-400">Completed</p>
              </div>
              <div className="glass-card p-3">
                <p className="text-2xl font-bold text-orange-500">{Math.floor(sessionsCompleted / 4)}</p>
                <p className="text-xs text-dark-400">Cycles</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Task Input Modal */}
      <AnimatePresence>
        {showTaskInput && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-dark-700 mb-4">What will you work on?</h3>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="input-field mb-4"
                placeholder="e.g., Complete LeetCode problem"
                autoFocus
              />
              <div className="flex gap-3">
                <button onClick={startWithTask} className="btn-primary flex-1">
                  Start Focus
                </button>
                <button
                  onClick={() => setShowTaskInput(false)}
                  className="btn-secondary"
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

export default PomodoroTimer;



