import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterInput = (props) => {
  const placeholders = [
    "Paste your long URL here...",
    "Shorten any link instantly...",
    "Share with the world...",
    "Track your clicks..."
  ];
  
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        {...props}
        placeholder="" // Clear default placeholder
        style={{
          ...props.style,
          width: '100%',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 2,
          position: 'relative'
        }}
      />
      {!props.value && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1rem', // Match input padding
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          <AnimatePresence mode='wait'>
            <motion.span
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.5 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: 'var(--text-secondary)' }}
            >
              {placeholders[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TypewriterInput;
