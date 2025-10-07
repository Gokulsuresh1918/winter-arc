import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  Home, 
  Dumbbell, 
  BookOpen, 
  User, 
  LogOut,
  Flame, 
  Utensils, 
  Target, 
  Book, 
  Sparkles,
  Calendar
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/motivation', icon: Sparkles, label: 'Motivation' },
    { path: '/fitness', icon: Dumbbell, label: 'Fitness' },
    { path: '/study', icon: BookOpen, label: 'Study' },
    { path: '/reading', icon: Book, label: 'Reading' },
    { path: '/food', icon: Utensils, label: 'Food' },
    { path: '/challenges', icon: Target, label: 'Challenges' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 glass-card m-4 p-6 flex flex-col"
      >
        {/* Logo */}
        <div className="mb-8">
          <Logo size="md" showText={true} animated={false} />
        </div>

        {/* User Info */}
        <div className="glass-card p-4 mb-6">
          <p className="text-sm text-dark-400">Welcome back,</p>
          <p className="text-lg font-semibold text-dark-700">{user?.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <Flame className="text-orange-500 w-4 h-4" />
            <span className="text-sm font-semibold text-orange-500">
              {user?.currentStreak || 0} Day Streak
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-glow-sm'
                    : 'text-dark-400 hover:bg-dark-200 hover:text-dark-700'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

