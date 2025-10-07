import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Droplet, TrendingUp, Lightbulb } from 'lucide-react';
import { getTodayFoodLog, updateFoodLog, getDailyRecipe, getWeeklyFoodStats } from '../utils/api';

const Food = () => {
  const [foodLog, setFoodLog] = useState(null);
  const [stats, setStats] = useState(null);
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [mealForm, setMealForm] = useState({
    mealType: 'breakfast',
    name: '',
    items: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logRes, statsRes, recipeRes] = await Promise.all([
        getTodayFoodLog(),
        getWeeklyFoodStats(),
        getDailyRecipe()
      ]);
      
      setFoodLog(logRes.data);
      setStats(statsRes.data);
      setRecipe(recipeRes.data.recipe);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMeal = async (e) => {
    e.preventDefault();
    try {
      const meal = {
        name: mealForm.name,
        items: mealForm.items.split(',').map(i => i.trim()),
        calories: parseInt(mealForm.calories) || 0,
        protein: parseInt(mealForm.protein) || 0,
        carbs: parseInt(mealForm.carbs) || 0,
        fats: parseInt(mealForm.fats) || 0
      };

      const updatedLog = { ...foodLog };
      updatedLog[mealForm.mealType] = meal;

      await updateFoodLog(foodLog._id, updatedLog);
      setMealForm({
        mealType: 'breakfast',
        name: '',
        items: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
      });
      fetchData();
    } catch (error) {
      console.error('Failed to update meal:', error);
    }
  };

  const handleUpdateWater = async (amount) => {
    try {
      const newWaterIntake = (foodLog.waterIntake || 0) + amount;
      await updateFoodLog(foodLog._id, { waterIntake: Math.max(0, newWaterIntake) });
      fetchData();
    } catch (error) {
      console.error('Failed to update water:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const calorieProgress = foodLog?.goals?.calories 
    ? Math.round((foodLog.totalCalories / foodLog.goals.calories) * 100)
    : 0;
    
  const proteinProgress = foodLog?.goals?.protein
    ? Math.round((foodLog.totalProtein / foodLog.goals.protein) * 100)
    : 0;
    
  const waterProgress = foodLog?.goals?.water
    ? Math.round((foodLog.waterIntake / foodLog.goals.water) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-700">🥗 Nutrition Tracker</h1>
        <p className="text-dark-400 mt-1">Track your meals and stay healthy</p>
      </div>

      {/* Daily Recipe Tip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 bg-gradient-to-r from-green-500/10 to-primary-500/10"
      >
        <div className="flex items-start gap-4">
          <Lightbulb className="text-yellow-500 w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-dark-700 mb-2">💡 Today's Healthy Tip</h3>
            <p className="text-dark-600">{recipe}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-start mb-2">
            <Utensils className="text-primary-500 w-6 h-6" />
            <span className="text-xs font-semibold text-primary-500">{calorieProgress}%</span>
          </div>
          <p className="text-2xl font-bold text-dark-700">{foodLog?.totalCalories || 0}</p>
          <p className="text-sm text-dark-400">of {foodLog?.goals?.calories || 2000} cal</p>
          <div className="w-full bg-dark-200 rounded-full h-2 mt-2">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-orange-500 font-bold">P</span>
            <span className="text-xs font-semibold text-orange-500">{proteinProgress}%</span>
          </div>
          <p className="text-2xl font-bold text-dark-700">{foodLog?.totalProtein || 0}g</p>
          <p className="text-sm text-dark-400">of {foodLog?.goals?.protein || 150}g protein</p>
          <div className="w-full bg-dark-200 rounded-full h-2 mt-2">
            <div
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${Math.min(proteinProgress, 100)}%` }}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex justify-between items-start mb-2">
            <Droplet className="text-blue-500 w-6 h-6" />
            <span className="text-xs font-semibold text-blue-500">{waterProgress}%</span>
          </div>
          <p className="text-2xl font-bold text-dark-700">{foodLog?.waterIntake?.toFixed(1) || 0}L</p>
          <p className="text-sm text-dark-400">of {foodLog?.goals?.water || 3}L water</p>
          <div className="w-full bg-dark-200 rounded-full h-2 mt-2">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${Math.min(waterProgress, 100)}%` }}
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <TrendingUp className="text-green-500 w-6 h-6 mb-2" />
          <p className="text-2xl font-bold text-dark-700">{stats?.avgCalories || 0}</p>
          <p className="text-sm text-dark-400">Avg Calories/Day</p>
        </motion.div>
      </div>

      {/* Water Quick Add */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-dark-700 mb-4">💧 Water Intake</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleUpdateWater(0.25)}
            className="btn-secondary"
          >
            + 250ml
          </button>
          <button
            onClick={() => handleUpdateWater(0.5)}
            className="btn-secondary"
          >
            + 500ml
          </button>
          <button
            onClick={() => handleUpdateWater(1)}
            className="btn-secondary"
          >
            + 1L
          </button>
          <button
            onClick={() => handleUpdateWater(-0.25)}
            className="btn-secondary"
          >
            - 250ml
          </button>
        </div>
      </motion.div>

      {/* Add Meal Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-dark-700 mb-4">🍽️ Log Meal</h3>
        
        <form onSubmit={handleUpdateMeal} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">Meal Type</label>
              <select
                value={mealForm.mealType}
                onChange={(e) => setMealForm({...mealForm, mealType: e.target.value})}
                className="input-field"
              >
                <option value="breakfast">🌅 Breakfast</option>
                <option value="lunch">☀️ Lunch</option>
                <option value="dinner">🌙 Dinner</option>
                <option value="snacks">🍪 Snacks</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">Meal Name</label>
              <input
                type="text"
                value={mealForm.name}
                onChange={(e) => setMealForm({...mealForm, name: e.target.value})}
                className="input-field"
                placeholder="Oatmeal Bowl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 mb-2">Items (comma separated)</label>
            <input
              type="text"
              value={mealForm.items}
              onChange={(e) => setMealForm({...mealForm, items: e.target.value})}
              className="input-field"
              placeholder="Oats, Banana, Almonds, Honey"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">Calories</label>
              <input
                type="number"
                value={mealForm.calories}
                onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
                className="input-field"
                placeholder="500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">Protein (g)</label>
              <input
                type="number"
                value={mealForm.protein}
                onChange={(e) => setMealForm({...mealForm, protein: e.target.value})}
                className="input-field"
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">Carbs (g)</label>
              <input
                type="number"
                value={mealForm.carbs}
                onChange={(e) => setMealForm({...mealForm, carbs: e.target.value})}
                className="input-field"
                placeholder="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-600 mb-2">Fats (g)</label>
              <input
                type="number"
                value={mealForm.fats}
                onChange={(e) => setMealForm({...mealForm, fats: e.target.value})}
                className="input-field"
                placeholder="15"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Save Meal
          </button>
        </form>
      </motion.div>

      {/* Today's Meals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-dark-700">Today's Meals</h3>
        
        {['breakfast', 'lunch', 'dinner'].map((mealType) => {
          const meal = foodLog?.[mealType];
          return (
            <div key={mealType} className="glass-card p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-dark-700 capitalize mb-1">
                    {mealType === 'breakfast' && '🌅'} 
                    {mealType === 'lunch' && '☀️'} 
                    {mealType === 'dinner' && '🌙'} 
                    {' '}{mealType}
                  </h4>
                  {meal && meal.name ? (
                    <>
                      <p className="text-sm text-dark-600 mb-2">{meal.name}</p>
                      {meal.items && meal.items.length > 0 && (
                        <p className="text-xs text-dark-400 mb-2">{meal.items.join(', ')}</p>
                      )}
                      <div className="flex gap-4 text-xs text-dark-400">
                        <span>🔥 {meal.calories} cal</span>
                        <span>🍗 {meal.protein}g protein</span>
                        {meal.carbs > 0 && <span>🍚 {meal.carbs}g carbs</span>}
                        {meal.fats > 0 && <span>🥑 {meal.fats}g fats</span>}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-dark-400">Not logged yet</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Food;


