import React, { useState } from 'react';
import axios from 'axios';
import './UrlShortener.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UrlShortener = ({ onUrlCreated, loading, setLoading }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [maxClicks, setMaxClicks] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);

    try {
      const payload = {
        originalUrl,
        customCode: customCode || undefined,
      };

      if (expiresAt) {
        payload.expiresAt = new Date(expiresAt).toISOString();
      }
      if (maxClicks) {
        payload.maxClicks = Number(maxClicks);
      }

      const response = await axios.post(`${API_BASE_URL}/urls/shorten`, {
        ...payload
      });

      setShortUrl(response.data.shortUrl);
      setOriginalUrl('');
      setCustomCode('');
      setExpiresAt('');
      setMaxClicks('');
      setShowCustomCode(false);
      setShowAdvanced(false);
      onUrlCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="url-shortener">
      <div className="shortener-card">
        <h2>Shorten Your URL</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="url"
              placeholder="Paste your long URL here..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          {showCustomCode && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Custom code (optional)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                disabled={loading}
                pattern="[A-Za-z0-9_-]+"
                title="Only letters, numbers, hyphens, and underscores allowed"
              />
            </div>
          )}

          {showAdvanced && (
            <div className="advanced-grid">
              <div className="input-group">
                <label className="input-label">Expire link at</label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  disabled={loading}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <small className="hint">Leave empty to never expire</small>
              </div>
              <div className="input-group">
                <label className="input-label">Max clicks</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={maxClicks}
                  onChange={(e) => setMaxClicks(e.target.value)}
                  disabled={loading}
                />
                <small className="hint">Optional cap; leave empty for unlimited</small>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowCustomCode(!showCustomCode)}
              disabled={loading}
            >
              {showCustomCode ? 'Hide' : 'Custom'} Code
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowAdvanced(!showAdvanced)}
              disabled={loading}
            >
              {showAdvanced ? 'Hide Options' : 'Expire/Limit'}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !originalUrl}
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {shortUrl && (
          <div className="result">
            <div className="result-label">Your short URL:</div>
            <div className="result-url">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
              <button 
                onClick={copyToClipboard} 
                className={`copy-btn ${copied ? 'copied' : ''}`}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;

