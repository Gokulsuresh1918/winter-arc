import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

const WorkoutSplit = ({ onSelectSplit }) => {
  const momentumSplit = [
    { day: 'Mon (Day 1)', focus: 'Chest + Triceps', color: 'orange' },
    { day: 'Tue (Day 2)', focus: 'Back + Biceps', color: 'blue' },
    { day: 'Wed (Day 3)', focus: 'Shoulders + Legs', color: 'purple' },
    { day: 'Thu (Day 4)', focus: 'Chest + Triceps', color: 'orange' },
    { day: 'Fri (Day 5)', focus: 'Back + Biceps', color: 'blue' },
    { day: 'Sat (Day 6)', focus: 'Shoulders + Legs', color: 'purple' },
    { day: 'Sun (Day 7)', focus: 'Rest / Active Recovery', color: 'green' }
  ];

  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentDayIndex = today === 0 ? 6 : today - 1; // Convert to 0 = Monday

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
  
    </motion.div>
  );
};

export default WorkoutSplit;