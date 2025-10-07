import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Dumbbell, Calendar } from 'lucide-react';

const WeeklyWorkoutTracker = () => {
  const [workoutData, setWorkoutData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

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

  const absExercises = [
    { name: 'Crunches', sets: '3 sets × 15-20 reps' },
    { name: 'Leg Raises', sets: '3 sets × 12-15 reps' },
    { name: 'Russian Twists', sets: '3 sets × 20 reps (each side)' },
    { name: 'Plank', sets: '3 sets × 45-60 seconds' },
    { name: 'Bicycle Crunches', sets: '3 sets × 15-20 reps' }
  ];

  const weekSchedule = [
    { day: 'Mon', workout: 'chest-triceps', needsAbs: true },
    { day: 'Tue', workout: 'back-biceps', needsAbs: false },
    { day: 'Wed', workout: 'shoulders-legs', needsAbs: true },
    { day: 'Thu', workout: 'chest-triceps', needsAbs: false },
    { day: 'Fri', workout: 'back-biceps', needsAbs: true },
    { day: 'Sat', workout: 'shoulders-legs', needsAbs: false },
    { day: 'Sun', workout: 'rest', needsAbs: false }
  ];

  // Get stored workout data from localStorage
  const getStoredWorkoutData = () => {
    const stored = localStorage.getItem('weekly-workout-data');
    return stored ? JSON.parse(stored) : {};
  };

  const [workoutProgress, setWorkoutProgress] = useState(getStoredWorkoutData);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('weekly-workout-data', JSON.stringify(workoutProgress));
  }, [workoutProgress]);

  const toggleExercise = (day, exerciseName) => {
    setWorkoutProgress(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exerciseName]: !prev[day]?.[exerciseName]
      }
    }));
  };

  const getDayProgress = (day) => {
    const dayData = workoutProgress[day];
    if (!dayData) return 0;
    
    const daySchedule = weekSchedule.find(d => d.day === day);
    if (daySchedule.workout === 'rest') return 0;
    
    const workout = workoutPlans[daySchedule.workout];
    const totalExercises = workout.exercises.length + (daySchedule.needsAbs ? absExercises.length : 0);
    const completedExercises = Object.values(dayData).filter(Boolean).length;
    
    return Math.round((completedExercises / totalExercises) * 100);
  };

  const isDayComplete = (day) => {
    return getDayProgress(day) === 100;
  };

  const getTotalWeeklyProgress = () => {
    const workoutDays = weekSchedule.filter(d => d.workout !== 'rest');
    const totalProgress = workoutDays.reduce((sum, day) => sum + getDayProgress(day.day), 0);
    return Math.round(totalProgress / workoutDays.length);
  };

  const handleDayClick = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  if (selectedDay) {
    const daySchedule = weekSchedule.find(d => d.day === selectedDay);
    const workout = workoutPlans[daySchedule.workout];
    const dayData = workoutProgress[selectedDay] || {};

    if (daySchedule.workout === 'rest') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-dark-700">{selectedDay} - Rest Day</h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="btn-secondary"
            >
              ← Back
            </button>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😴</div>
            <h4 className="text-xl font-bold text-dark-700 mb-2">Rest Day</h4>
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

    const progress = getDayProgress(selectedDay);
    const isComplete = isDayComplete(selectedDay);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-dark-700">{selectedDay} - {workout.name}</h3>
            {daySchedule.needsAbs && (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold mt-2 inline-block">
                🔥 + ABS
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedDay(null)}
            className="btn-secondary"
          >
            ← Back
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-dark-400">Workout Progress</span>
            <span className={`font-semibold ${isComplete ? 'text-green-500' : `text-${workout.color}-500`}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-dark-200 rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                isComplete
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : `bg-gradient-to-r from-${workout.color}-600 to-${workout.color}-400`
              }`}
            />
          </div>
        </div>

        {/* Main Workout */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-dark-600 uppercase tracking-wide">
            Main Workout
          </h4>
          {workout.exercises.map((exercise, index) => {
            const isChecked = dayData[exercise.name] || false;
            
            return (
              <motion.button
                key={exercise.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => toggleExercise(selectedDay, exercise.name)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isChecked
                    ? `border-${workout.color}-500 bg-${workout.color}-500/10`
                    : 'border-dark-200 hover:border-dark-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? `border-${workout.color}-500 bg-${workout.color}-500`
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
        {daySchedule.needsAbs && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px bg-gradient-to-r from-yellow-500 to-orange-500 flex-1"></div>
              <h4 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 uppercase tracking-wide">
                🔥 ABS WORKOUT
              </h4>
              <div className="h-px bg-gradient-to-r from-orange-500 to-yellow-500 flex-1"></div>
            </div>
            
            {absExercises.map((exercise, index) => {
              const isChecked = dayData[exercise.name] || false;
              
              return (
                <motion.button
                  key={exercise.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (workout.exercises.length + index) * 0.05 }}
                  onClick={() => toggleExercise(selectedDay, exercise.name)}
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
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-lg text-center font-semibold bg-green-500/20 text-green-600 border-2 border-green-500"
          >
            <span className="text-3xl mr-2">🎉</span>
            Workout Complete! Beast mode activated! 💪🔥
            <span className="text-3xl ml-2">🎉</span>
          </motion.div>
        )}
      </motion.div>
    );
  }

  const weeklyProgress = getTotalWeeklyProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-dark-700 mb-1">💪 Weekly Workout Tracker</h3>
          <p className="text-sm text-dark-400">Click any day to track your workout</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary-500">{weeklyProgress}%</p>
          <p className="text-xs text-dark-400">Weekly Progress</p>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-dark-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${weeklyProgress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
          />
        </div>
      </div>

      {/* Week Schedule */}
      <div className="grid grid-cols-7 gap-3">
        {weekSchedule.map((day, index) => {
          const progress = getDayProgress(day.day);
          const isComplete = isDayComplete(day.day);
          const isRest = day.workout === 'rest';
          
          return (
            <motion.button
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleDayClick(day.day)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                isComplete
                  ? 'border-green-500 bg-green-500/20'
                  : isRest
                  ? 'border-gray-400 bg-gray-400/20'
                  : 'border-dark-200 hover:border-primary-500'
              }`}
            >
              <div className="text-2xl mb-2">
                {isRest ? '😴' : workoutPlans[day.workout].emoji}
              </div>
              <p className="font-bold text-dark-700 mb-1">{day.day}</p>
              <p className="text-xs text-dark-400 mb-2">
                {isRest ? 'Rest' : workoutPlans[day.workout].name}
              </p>
              {day.needsAbs && !isRest && (
                <p className="text-xs text-orange-500 font-bold">+ ABS</p>
              )}
              <div className="mt-2">
                {isComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                ) : isRest ? (
                  <Circle className="w-6 h-6 text-gray-400 mx-auto" />
                ) : (
                  <div className="w-6 h-6 border-2 border-dark-300 rounded-full mx-auto"></div>
                )}
              </div>
              {!isRest && (
                <p className="text-xs text-dark-400 mt-1">{progress}%</p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="glass-card p-3 text-center">
          <Dumbbell className="text-primary-500 w-5 h-5 mx-auto mb-1" />
          <p className="text-lg font-bold text-dark-700">
            {weekSchedule.filter(d => d.workout !== 'rest').length}
          </p>
          <p className="text-xs text-dark-400">Workout Days</p>
        </div>
        <div className="glass-card p-3 text-center">
          <CheckCircle2 className="text-green-500 w-5 h-5 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-500">
            {weekSchedule.filter(d => d.workout !== 'rest' && isDayComplete(d.day)).length}
          </p>
          <p className="text-xs text-dark-400">Completed</p>
        </div>
        <div className="glass-card p-3 text-center">
          <Calendar className="text-orange-500 w-5 h-5 mx-auto mb-1" />
          <p className="text-lg font-bold text-orange-500">{weeklyProgress}%</p>
          <p className="text-xs text-dark-400">Weekly</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyWorkoutTracker;

