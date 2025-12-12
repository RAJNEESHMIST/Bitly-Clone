const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const { getDatabase } = require('../database');

function parseExpiry(expiresAtRaw) {
  if (!expiresAtRaw) return null;
  const date = new Date(expiresAtRaw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isExpired(row) {
  const expiresAt = parseExpiry(row.expires_at);
  if (expiresAt && expiresAt.getTime() <= Date.now()) {
    return { expired: true, reason: 'expired' };
  }

  if (row.max_clicks && Number(row.max_clicks) > 0 && row.clicks >= row.max_clicks) {
    return { expired: true, reason: 'max_clicks' };
  }

  return { expired: false, reason: null };
}

function buildResponseRow(row, baseUrl) {
  const status = isExpired(row);
  return {
    id: row.id,
    originalUrl: row.original_url,
    shortCode: row.short_code,
    shortUrl: `${baseUrl}/${row.short_code}`,
    clicks: row.clicks,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    maxClicks: row.max_clicks,
    isExpired: status.expired,
    expiredReason: status.reason,
    clicksRemaining: row.max_clicks ? Math.max(row.max_clicks - row.clicks, 0) : null
  };
}

// Create short URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl, customCode, expiresAt, maxClicks } = req.body;
    
    // Validate URL
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Validate optional expiry
    let normalizedExpiry = null;
    if (expiresAt) {
      const parsed = new Date(expiresAt);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({ error: 'Invalid expiration date' });
      }
      if (parsed.getTime() <= Date.now()) {
        return res.status(400).json({ error: 'Expiration must be in the future' });
      }
      normalizedExpiry = parsed.toISOString();
    }

    // Validate optional max clicks
    let normalizedMaxClicks = null;
    if (maxClicks !== undefined && maxClicks !== null && maxClicks !== '') {
      const parsedMax = parseInt(maxClicks, 10);
      if (Number.isNaN(parsedMax) || parsedMax <= 0) {
        return res.status(400).json({ error: 'Max clicks must be a positive number' });
      }
      normalizedMaxClicks = parsedMax;
    }

    const db = getDatabase();
    let shortCode = customCode || nanoid(8);
    
    // If custom code provided, check if it exists
    if (customCode) {
      const existing = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM urls WHERE short_code = ?', [customCode], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      
      if (existing) {
        return res.status(400).json({ error: 'Custom code already exists' });
      }
    } else {
      // Check if generated code exists (very unlikely but handle it)
      let exists = true;
      while (exists) {
        const existing = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM urls WHERE short_code = ?', [shortCode], (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
        
        if (!existing) {
          exists = false;
        } else {
          shortCode = nanoid(8);
        }
      }
    }
    
    // Insert new URL
    db.run(
      'INSERT INTO urls (original_url, short_code, expires_at, max_clicks) VALUES (?, ?, ?, ?)',
      [originalUrl, shortCode, normalizedExpiry, normalizedMaxClicks],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to create short URL' });
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.json({
          ...buildResponseRow({
            id: this.lastID,
            original_url: originalUrl,
            short_code: shortCode,
            clicks: 0,
            created_at: new Date().toISOString(),
            expires_at: normalizedExpiry,
            max_clicks: normalizedMaxClicks
          }, baseUrl)
        });
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all URLs (for stats)
router.get('/', (req, res) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit) || 50;
  
  db.all(
    'SELECT * FROM urls ORDER BY created_at DESC LIMIT ?',
    [limit],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch URLs' });
      }
      
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const urls = rows.map(row => buildResponseRow(row, baseUrl));
      
      res.json(urls);
    }
  );
});

// Get URL by short code
router.get('/:code', (req, res) => {
  const db = getDatabase();
  const { code } = req.params;
  
  db.get('SELECT * FROM urls WHERE short_code = ?', [code], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json(buildResponseRow(row, baseUrl));
  });
});

// Redirect to original URL
router.get('/:code/redirect', (req, res) => {
  const db = getDatabase();
  const { code } = req.params;
  
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

// Get stats for a short code
router.get('/:code/stats', (req, res) => {
  const db = getDatabase();
  const { code } = req.params;
  
  db.get('SELECT * FROM urls WHERE short_code = ?', [code], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.json(buildResponseRow(row, baseUrl));
  });
});

module.exports = router;

