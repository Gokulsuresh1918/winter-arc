import axios from 'axios';

// Use environment variable for API URL, fallback to /api for proxy
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Day Logs
export const getDayLogToday = () => API.get('/daylogs/today');
export const getDayLogs = (startDate, endDate) => 
  API.get('/daylogs', { params: { startDate, endDate } });
export const updateDayLog = (id, data) => API.put(`/daylogs/${id}`, data);
export const getStreak = () => API.get('/daylogs/streak');

// Workouts
export const getWorkouts = (startDate, endDate) => 
  API.get('/workouts', { params: { startDate, endDate } });
export const createWorkout = (data) => API.post('/workouts', data);
export const updateWorkout = (id, data) => API.put(`/workouts/${id}`, data);
export const deleteWorkout = (id) => API.delete(`/workouts/${id}`);
export const getWeeklyWorkoutStats = () => API.get('/workouts/stats/weekly');

// Study Sessions
export const getStudySessions = (startDate, endDate, category) => 
  API.get('/study', { params: { startDate, endDate, category } });
export const createStudySession = (data) => API.post('/study', data);
export const updateStudySession = (id, data) => API.put(`/study/${id}`, data);
export const deleteStudySession = (id) => API.delete(`/study/${id}`);
export const getStudyStatsByCategory = () => API.get('/study/stats/category');

// Journal Entries
export const getJournalEntries = (startDate, endDate) => 
  API.get('/journal', { params: { startDate, endDate } });
export const createJournalEntry = (data) => API.post('/journal', data);
export const updateJournalEntry = (id, data) => API.put(`/journal/${id}`, data);
export const getTodayJournalEntry = () => API.get('/journal/today/entry');

// User Profile
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (data) => API.put('/users/profile', data);
export const awardBadge = (name, icon) => API.post('/users/badges', { name, icon });

// Quotes
export const getDailyQuote = () => API.get('/quotes/daily');
export const getRandomQuote = () => API.get('/quotes/random');

// Books
export const getBooks = () => API.get('/books');
export const getCurrentBooks = () => API.get('/books/current');
export const createBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const logReading = (id, data) => API.post(`/books/${id}/reading`, data);
export const addBookNote = (id, data) => API.post(`/books/${id}/notes`, data);
export const getReadingStats = () => API.get('/books/stats/summary');

// Food Logs
export const getTodayFoodLog = () => API.get('/food/today');
export const getFoodLogs = (startDate, endDate) => API.get('/food', { params: { startDate, endDate } });
export const updateFoodLog = (id, data) => API.put(`/food/${id}`, data);
export const getDailyRecipe = () => API.get('/food/recipe/daily');
export const getWeeklyFoodStats = () => API.get('/food/stats/weekly');

// Challenges
export const getChallenges = () => API.get('/challenges');
export const getActiveChallenge = (type) => API.get(`/challenges/${type}/active`);
export const createChallenge = (data) => API.post('/challenges', data);
export const resetChallenge = (id, reason) => API.post(`/challenges/${id}/reset`, { reason });
export const logChallengeProgress = (id, data) => API.post(`/challenges/${id}/log`, data);
export const updateChallenge = (id, data) => API.put(`/challenges/${id}`, data);
export const deleteChallenge = (id) => API.delete(`/challenges/${id}`);
export const getMotivationalQuote = () => API.get('/challenges/quote/motivation');

// Workout Plans
export const getWorkoutPlans = () => API.get('/workout-plans');
export const getWorkoutPlansBySplit = (split) => API.get(`/workout-plans/split/${split}`);
export const createWorkoutPlan = (data) => API.post('/workout-plans', data);
export const updateWorkoutPlan = (id, data) => API.put(`/workout-plans/${id}`, data);
export const deleteWorkoutPlan = (id) => API.delete(`/workout-plans/${id}`);

// Finance
export const getTodayFinanceLog = () => API.get('/finance/today');
export const getFinanceLogs = (startDate, endDate) => API.get('/finance', { params: { startDate, endDate } });
export const addTransaction = (id, data) => API.post(`/finance/${id}/transaction`, data);
export const deleteTransaction = (id, transactionId) => API.delete(`/finance/${id}/transaction/${transactionId}`);
export const getMonthlyFinanceStats = () => API.get('/finance/stats/monthly');
export const updateBudget = (id, data) => API.put(`/finance/${id}/budget`, data);

// Body Metrics
export const logBodyMetrics = (data) => API.post('/body-metrics', data);
export const getBodyMetrics = (startDate, endDate) => API.get('/body-metrics', { params: { startDate, endDate } });
export const getLatestBodyMetrics = () => API.get('/body-metrics/latest');
export const updateBodyMetrics = (id, data) => API.put(`/body-metrics/${id}`, data);
export const deleteBodyMetrics = (id) => API.delete(`/body-metrics/${id}`);
export const getWeightProgress = () => API.get('/body-metrics/progress/weight');

// Daily Schedule
export const getTodaySchedule = () => API.get('/schedule/today');
export const getSchedules = (startDate, endDate) => API.get('/schedule', { params: { startDate, endDate } });
export const updateMorningCheckIn = (id, data) => API.put(`/schedule/${id}/morning-checkin`, data);
export const updateScheduleActivity = (id, activityId, data) => API.put(`/schedule/${id}/activity/${activityId}`, data);
export const logPomodoroSession = (id, data) => API.post(`/schedule/${id}/pomodoro`, data);
export const getWeeklyScheduleStats = () => API.get('/schedule/stats/weekly');

export default API;

