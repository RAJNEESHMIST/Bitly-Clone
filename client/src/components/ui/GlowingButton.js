import React from 'react';
import { motion } from 'framer-motion';
import './GlowingButton.css';

const GlowingButton = ({ children, onClick, disabled, className = '', type = 'button' }) => {
  return (
    <motion.button
      type={type}
      className={`glowing-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="glowing-btn-bg"></span>
      <span className="glowing-btn-content">{children}</span>
    </motion.button>
  );
};

export default GlowingButton;
