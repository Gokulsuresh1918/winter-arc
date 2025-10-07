import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { getDailyQuote } from '../utils/api';

const QuoteCard = () => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const { data } = await getDailyQuote();
        setQuote(data.quote);
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      }
    };
    fetchQuote();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative">
        <Quote className="text-primary-500 w-8 h-8 mb-4" />
        <p className="text-lg text-dark-700 italic leading-relaxed">
          "{quote}"
        </p>
      </div>
    </motion.div>
  );
};

export default QuoteCard;

