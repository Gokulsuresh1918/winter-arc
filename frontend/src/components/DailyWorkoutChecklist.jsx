import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Dumbbell, RotateCcw } from 'lucide-react';

const DailyWorkoutChecklist = () => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentDayIndex = today === 0 ? 6 : today - 1; // Convert to 0 = Monday

  const absExercises = [
    { name: 'Crunches', sets: '3 sets × 15-20 reps' },
    { name: 'Leg Raises', sets: '3 sets × 12-15 reps' },
    { name: 'Russian Twists', sets: '3 sets × 20 reps (each side)' },
    { name: 'Plank', sets: '3 sets × 45-60 seconds' },
    { name: 'Bicycle Crunches', sets: '3 sets × 15-20 reps' }
  ];

  const workoutPlans = {
    'chest-triceps': {
      name: 'Chest + Triceps',
      color: 'orange',
      emoji: '💪',
      exercises: [
        { name: 'Flat Bench Press', sets: '4 sets × 8-10 reps' },
        { name: 'Incline Dumbbell Press', sets: '4 sets × 10-12 reps' },
        { name: 'Cable Flyes', sets: '3 sets × 12-15 reps' },
        { name: 'Dips (Chest Focus)', sets: '3 sets × 10-12 reps' },
        { name: 'Tricep Pushdowns', sets: '3 sets × 12-15 reps' },
        { name: 'Overhead Tricep Extension', sets: '3 sets × 10-12 reps' },
        { name: 'Tricep Dips', sets: '3 sets × 10-12 reps' }
      ]
    },
    'back-biceps': {
      name: 'Back + Biceps',
      color: 'blue',
      emoji: '🏋️',
      exercises: [
        { name: 'Pull-ups / Lat Pulldown', sets: '4 sets × 8-10 reps' },
        { name: 'Barbell Rows', sets: '4 sets × 10-12 reps' },
        { name: 'Seated Cable Rows', sets: '3 sets × 12-15 reps' },
        { name: 'Single Arm Dumbbell Rows', sets: '3 sets × 10-12 reps each' },
        { name: 'Barbell Curls', sets: '3 sets × 10-12 reps' },
        { name: 'Hammer Curls', sets: '3 sets × 12-15 reps' },
        { name: 'Cable Curls', sets: '3 sets × 12-15 reps' }
      ]
    },
    'shoulders-legs': {
      name: 'Shoulders + Legs',
      color: 'purple',
      emoji: '🦵',
      exercises: [
        { name: 'Military Press / Shoulder Press', sets: '4 sets × 8-10 reps' },
        { name: 'Lateral Raises', sets: '4 sets × 12-15 reps' },
        { name: 'Front Raises', sets: '3 sets × 12-15 reps' },
        { name: 'Rear Delt Flyes', sets: '3 sets × 12-15 reps' },
        { name: 'Squats', sets: '4 sets × 10-12 reps' },
        { name: 'Leg Press', sets: '3 sets × 12-15 reps' },
        { name: 'Leg Curls', sets: '3 sets × 12-15 reps' },
        { name: 'Calf Raises', sets: '4 sets × 15-20 reps' }
      ]
    }
  };

  const weekSchedule = [
    { day: 'Mon (Day 1)', workout: 'chest-triceps' },
    { day: 'Tue (Day 2)', workout: 'back-biceps' },
    { day: 'Wed (Day 3)', workout: 'shoulders-legs' },
    { day: 'Thu (Day 4)', workout: 'chest-triceps' },
    { day: 'Fri (Day 5)', workout: 'back-biceps' },
    { day: 'Sat (Day 6)', workout: 'shoulders-legs' },
    { day: 'Sun (Day 7)', workout: 'rest' }
  ];

  const todaySchedule = weekSchedule[currentDayIndex];
  const todayWorkout = todaySchedule.workout !== 'rest' ? workoutPlans[todaySchedule.workout] : null;
  
  // Check if today needs abs (Mon=0, Wed=2, Fri=4)
  const needsAbs = [0, 2, 4].includes(currentDayIndex);
  
  // Combine exercises with abs if needed
  const todayExercises = todayWorkout 
    ? needsAbs 
      ? [...todayWorkout.exercises, ...absExercises]
      : todayWorkout.exercises
    : [];

  // Get checklist state from localStorage
  const getStoredChecklist = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(`workout-checklist-${today}`);
    return stored ? JSON.parse(stored) : {};
  };

  const [checkedExercises, setCheckedExercises] = useState(getStoredChecklist);

  // Save to localStorage whenever checklist changes
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`workout-checklist-${today}`, JSON.stringify(checkedExercises));
  }, [checkedExercises]);

  // Clear checklist at midnight
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setCheckedExercises({});
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkMidnight);
  }, []);

  const toggleExercise = (exerciseName) => {
    setCheckedExercises(prev => ({
      ...prev,
      [exerciseName]: !prev[exerciseName]
    }));
  };

  const resetChecklist = () => {
    if (window.confirm('Reset today\'s workout checklist?')) {
      setCheckedExercises({});
    }
  };

  const calculateProgress = () => {
    if (!todayWorkout) return 0;
    const total = todayExercises.length;
    const completed = Object.values(checkedExercises).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  if (todaySchedule.workout === 'rest') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😴</div>
          <h3 className="text-2xl font-bold text-dark-700 mb-2">Rest Day</h3>
          <p className="text-dark-400">Recovery is part of growth. Relax and recharge! 🌙</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="glass-card p-4">
              <p className="text-sm text-dark-400">Stretch</p>
              <p className="text-2xl">🧘</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-dark-400">Hydrate</p>
              <p className="text-2xl">💧</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-dark-400">Sleep</p>
              <p className="text-2xl">😴</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">{todayWorkout.emoji}</span>
            <h3 className="text-2xl font-bold text-dark-700">{todaySchedule.day}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-lg font-semibold text-${todayWorkout.color}-500`}>
              {todayWorkout.name}
            </p>
            {needsAbs && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold">
                🔥 + ABS
              </span>
            )}
          </div>
        </div>
        <button
          onClick={resetChecklist}
          className="btn-secondary flex items-center gap-2"
          title="Reset Checklist"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-dark-400">Workout Progress</span>
          <span className={`font-semibold ${
            progress === 100 ? 'text-green-500' : `text-${todayWorkout.color}-500`
          }`}>
            {Object.values(checkedExercises).filter(Boolean).length} / {todayExercises.length} ({progress}%)
          </span>
        </div>
        <div className="w-full bg-dark-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              progress === 100
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : `bg-gradient-to-r from-${todayWorkout.color}-600 to-${todayWorkout.color}-400`
            }`}
          />
        </div>
      </div>

      {/* Main Workout Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-dark-600 uppercase tracking-wide">
          Main Workout
        </h4>
        {todayWorkout.exercises.map((exercise, index) => {
          const isChecked = checkedExercises[exercise.name] || false;
          
          return (
            <motion.button
              key={exercise.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleExercise(exercise.name)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isChecked
                  ? `border-${todayWorkout.color}-500 bg-${todayWorkout.color}-500/10`
                  : 'border-dark-200 hover:border-dark-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    isChecked
                      ? `border-${todayWorkout.color}-500 bg-${todayWorkout.color}-500`
                      : 'border-dark-300'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      isChecked ? 'text-dark-700 line-through' : 'text-dark-700'
                    }`}>
                      {exercise.name}
                    </p>
                    <p className="text-sm text-dark-400">{exercise.sets}</p>
                  </div>
                </div>
                
                {isChecked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    ✅
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Abs Section */}
      {needsAbs && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-px bg-gradient-to-r from-yellow-500 to-orange-500 flex-1"></div>
            <h4 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 uppercase tracking-wide">
              🔥 ABS WORKOUT
            </h4>
            <div className="h-px bg-gradient-to-r from-orange-500 to-yellow-500 flex-1"></div>
          </div>
          
          {absExercises.map((exercise, index) => {
            const isChecked = checkedExercises[exercise.name] || false;
            
            return (
              <motion.button
                key={exercise.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (todayWorkout.exercises.length + index) * 0.05 }}
                onClick={() => toggleExercise(exercise.name)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isChecked
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-dark-200 hover:border-dark-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-dark-300'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        isChecked ? 'text-dark-700 line-through' : 'text-dark-700'
                      }`}>
                        {exercise.name}
                      </p>
                      <p className="text-sm text-dark-400">{exercise.sets}</p>
                    </div>
                  </div>
                  
                  {isChecked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-2xl"
                    >
                      ✅
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Completion Message */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-6 p-4 rounded-lg text-center font-semibold bg-green-500/20 text-green-600 border-2 border-green-500`}
        >
          <span className="text-3xl mr-2">🎉</span>
          Workout Complete! Beast mode activated! 💪🔥
          <span className="text-3xl ml-2">🎉</span>
        </motion.div>
      )}

      {/* Tips */}
      <div className="mt-6 pt-4 border-t border-dark-200">
        <div className="glass-card p-4 bg-primary-500/10">
          <p className="text-sm text-dark-600">
            <span className="font-semibold">💡 Pro Tip:</span> Check off each exercise as you complete it. Rest 60-90 seconds between sets!
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <Dumbbell className={`text-${todayWorkout.color}-500 w-5 h-5 mx-auto mb-1`} />
          <p className="text-lg font-bold text-dark-700">{todayExercises.length}</p>
          <p className="text-xs text-dark-400">
            {needsAbs ? 'Total Exercises' : 'Exercises'}
          </p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-green-500">{Object.values(checkedExercises).filter(Boolean).length}</p>
          <p className="text-xs text-dark-400">Completed</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-orange-500">
            {todayExercises.length - Object.values(checkedExercises).filter(Boolean).length}
          </p>
          <p className="text-xs text-dark-400">Remaining</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyWorkoutChecklist;

