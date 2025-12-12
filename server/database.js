const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'bityly.db');
const DB_DIR = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db = null;

function getDatabase() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('✅ Connected to SQLite database');
      }
    });
  }
  return db;
}

function initDatabase() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.serialize(() => {
      database.run(`
        CREATE TABLE IF NOT EXISTS urls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          original_url TEXT NOT NULL,
          short_code TEXT UNIQUE NOT NULL,
          clicks INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          reject(err);
        } else {
          ensureUrlSchema(database)
            .then(() => {
              console.log('✅ Database tables initialized');
              resolve();
            })
            .catch((schemaErr) => {
              console.error('Error updating schema:', schemaErr);
              reject(schemaErr);
            });
        }
      });
    });
  });
}

function ensureUrlSchema(database) {
  // Adds new columns for optional link expiration and click caps without breaking existing data
  const neededColumns = [
    { name: 'expires_at', ddl: 'ALTER TABLE urls ADD COLUMN expires_at DATETIME' },
    { name: 'max_clicks', ddl: 'ALTER TABLE urls ADD COLUMN max_clicks INTEGER' }
  ];

  return new Promise((resolve, reject) => {
    database.all('PRAGMA table_info(urls)', async (err, rows) => {
      if (err) return reject(err);

      const existing = rows.map((r) => r.name);
      const migrations = neededColumns
        .filter((col) => !existing.includes(col.name))
        .map((col) => () => new Promise((res, rej) => {
          database.run(col.ddl, (alterErr) => {
            if (alterErr) rej(alterErr);
            else res();
          });
        }));

      // Run migrations sequentially to avoid SQLite locking issues
      try {
        for (const migrate of migrations) {
          await migrate();
        }
        resolve();
      } catch (migrationErr) {
        reject(migrationErr);
      }
    });
  });
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          db = null;
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  getDatabase,
  initDatabase,
  closeDatabase
};

