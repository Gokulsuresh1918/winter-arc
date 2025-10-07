import { motion } from 'framer-motion';

const Logo = ({ size = 'md', variant = 'icon', showText = false, animated = true }) => {
  const sizes = {
    xs: { icon: 24, text: 'text-lg' },
    sm: { icon: 32, text: 'text-xl' },
    md: { icon: 48, text: 'text-2xl' },
    lg: { icon: 64, text: 'text-3xl' },
    xl: { icon: 96, text: 'text-4xl' },
  };

  const currentSize = sizes[size];

  const IconSVG = () => (
    <svg 
      width={currentSize.icon} 
      height={currentSize.icon} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`iconGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#6366f1', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#a855f7', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id={`boltGradient-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{stopColor:'#fbbf24', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#f59e0b', stopOpacity:1}} />
        </linearGradient>
        <filter id={`iconGlow-${size}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill={`url(#iconGradient-${size})`}/>
      
      <path 
        d="M55 15 L35 47.5 L47.5 47.5 L42.5 70 L65 42.5 L52.5 42.5 L60 27.5 Z" 
        fill={`url(#boltGradient-${size})`}
        filter={`url(#iconGlow-${size})`}
      />
      
      <path d="M 70 30 Q 75 40, 72 50" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 77 33 Q 82 43, 79 53" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );

  const logoContent = (
    <div className="flex items-center gap-3">
      <IconSVG />
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${currentSize.text} font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent`}>
            MOMENTUM
          </h1>
          <p className="text-xs text-dark-400 tracking-wider">BUILD • PROGRESS • ACHIEVE</p>
        </div>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
      >
        {logoContent}
      </motion.div>
    );
  }

  return logoContent;
};

export default Logo;

