const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Datenbank-Verbindung
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFile = path.join(dataDir, 'db.sqlite');
const db = new sqlite3.Database(dbFile);

// Promise wrapper für db.run
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Promise wrapper für db.get
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Auth-Tabelle erstellen (synchron beim Start)
let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) return;
  
  try {
    await dbRun(`CREATE TABLE IF NOT EXISTS auth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    dbInitialized = true;
    console.log('Auth-Tabelle initialisiert');
  } catch (err) {
    console.error('Fehler beim Initialisieren der Auth-Tabelle:', err);
    throw err;
  }
}

// Passwort setzen (nur wenn noch keins existiert)
async function setPassword(password) {
  await initializeDatabase();
  
  const row = await dbGet('SELECT COUNT(*) as count FROM auth');
  
  if (row.count > 0) {
    throw new Error('Passwort wurde bereits gesetzt');
  }
  
  const hash = await bcrypt.hash(password, 10);
  const result = await dbRun('INSERT INTO auth (password_hash) VALUES (?)', [hash]);
  return result.lastID;
}

// Passwort verifizieren
async function verifyPassword(password) {
  await initializeDatabase();
  
  const row = await dbGet('SELECT password_hash FROM auth ORDER BY id DESC LIMIT 1');
  
  if (!row) return false;
  
  const match = await bcrypt.compare(password, row.password_hash);
  return match;
}

// Prüfen ob Passwort bereits gesetzt wurde
async function isPasswordSet() {
  await initializeDatabase();
  
  const row = await dbGet('SELECT COUNT(*) as count FROM auth');
  return row.count > 0;
}

// Middleware zum Schutz von Routen
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.status(401).json({ error: 'Nicht authentifiziert' });
}

module.exports = {
  setPassword,
  verifyPassword,
  isPasswordSet,
  requireAuth
};