import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <span className="logo-icon">🔗</span>
          Bityly
        </h1>
        <p className="tagline">Shorten your URLs quickly and easily</p>
      </div>
    </header>
  );
};

export default Header;

