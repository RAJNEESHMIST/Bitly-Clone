import React, { useState } from 'react';
import './UrlList.css';
import CircularGauge from './ui/CircularGauge';

const UrlList = ({ urls }) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const d = new Date(dateString);
    return Number.isNaN(d.getTime()) ? 'Unknown' : d.toLocaleString();
  };

  if (urls.length === 0) {
    return (
      <div className="url-list">
        <div className="empty-state">
          <p>No shortened URLs yet. Create one above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="url-list">
      <h2 className="list-title">Recent URLs</h2>
      <div className="urls-grid">
        {urls.map((url) => (
          <div key={url.id} className="url-card">
            <div className="url-card-header">
              <div className="badge-row">
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <CircularGauge 
                    value={url.clicks} 
                    max={url.maxClicks || Infinity} 
                    size={60} 
                    strokeWidth={6} 
                  />
                </div>
                {url.isExpired && (
                  <span className="url-badge danger">Expired</span>
                )}
              </div>
            </div>
            <div className="url-card-body">
              <div className="url-original">
                <span className="label">Original:</span>
                <a 
                  href={url.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="original-link"
                >
                  {url.originalUrl.length > 50 
                    ? `${url.originalUrl.substring(0, 50)}...` 
                    : url.originalUrl}
                </a>
              </div>
              <div className="url-short">
                <span className="label">Short:</span>
                <div className="short-url-container">
                  <a 
                    href={url.shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="short-link"
                  >
                    {url.shortUrl}
                  </a>
                  <button 
                    onClick={() => copyToClipboard(url.shortUrl, url.id)}
                    className={`copy-icon-btn ${copiedId === url.id ? 'copied' : ''}`}
                    title={copiedId === url.id ? 'Copied!' : 'Copy'}
                  >
                    {copiedId === url.id ? '✓' : '📋'}
                  </button>
                </div>
              </div>
            </div>
            <div className="url-card-footer">
              <span className="url-date">
                Created: {new Date(url.createdAt).toLocaleDateString()}
              </span>
              <span className="url-date">
                Expires: {formatDate(url.expiresAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlList;

