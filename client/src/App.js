import React, { useState, useEffect } from 'react';
import './App.css';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';
import Header from './components/Header';
import ThemeToggle from './components/ThemeToggle';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/urls`);
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleUrlCreated = (newUrl) => {
    setUrls([newUrl, ...urls]);
  };

  return (
    <div className="App">
      <ThemeToggle />
      <Header />
      <div className="container">
        <UrlShortener 
          onUrlCreated={handleUrlCreated}
          loading={loading}
          setLoading={setLoading}
        />
        <UrlList urls={urls} />
      </div>
    </div>
  );
}

export default App;

