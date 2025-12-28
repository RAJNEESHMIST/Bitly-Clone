import React from 'react';
import { motion } from 'framer-motion';

const CircularGauge = ({ value, max, size = 120, strokeWidth = 10, label = "Clicks" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const dashoffset = circumference - progress * circumference;

  // Determine color based on usage
  const getColor = () => {
    if (progress > 0.9) return '#f87171'; // Red/Danger
    if (progress > 0.7) return '#facc15'; // Yellow/Warning
    return '#34d399'; // Green/Good
  };

  const strokeColor = getColor();

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor})` }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center', color: 'var(--text-primary)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>/ {max === Infinity ? '∞' : max}</div>
      </div>
    </div>
  );
};

export default CircularGauge;
