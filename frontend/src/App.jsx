import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Motivation from './pages/Motivation';
import Fitness from './pages/Fitness';
import Study from './pages/Study';
import Reading from './pages/Reading';
import Food from './pages/Food';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="motivation" element={<Motivation />} />
            <Route path="fitness" element={<Fitness />} />
            <Route path="study" element={<Study />} />
            <Route path="reading" element={<Reading />} />
            <Route path="food" element={<Food />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

