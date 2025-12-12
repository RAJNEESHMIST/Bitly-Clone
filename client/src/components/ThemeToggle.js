import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="theme-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="theme-text">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;

