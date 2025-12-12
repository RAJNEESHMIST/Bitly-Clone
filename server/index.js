const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDatabase, getDatabase } = require('./database');
const urlRoutes = require('./routes/urls');

const isExpired = (row) => {
  const expiresAt = row.expires_at ? new Date(row.expires_at) : null;
  if (expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= Date.now()) {
    return { expired: true, reason: 'expired' };
  }
  if (row.max_clicks && Number(row.max_clicks) > 0 && row.clicks >= row.max_clicks) {
    return { expired: true, reason: 'max_clicks' };
  }
  return { expired: false, reason: null };
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bityly API is running' });
});

// Routes
app.use('/api/urls', urlRoutes);

// Root-level redirect route (e.g., /abc123)
// This should be last to avoid catching other routes
app.get('/:code', (req, res, next) => {
  const db = getDatabase();
  const { code } = req.params;
  
  // Only process if it looks like a short code (alphanumeric, 3-20 chars)
  if (!/^[A-Za-z0-9_-]{3,20}$/.test(code)) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  db.get('SELECT * FROM urls WHERE short_code = ?', [code], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    const expiryState = isExpired(row);
    if (expiryState.expired) {
      return res.status(410).json({ error: `Short URL inactive (${expiryState.reason})` });
    }
    
    // Update click count
    db.run('UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?', [code]);
    
    res.redirect(row.original_url);
  });
});

// Initialize database
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

