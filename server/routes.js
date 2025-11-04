const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./auth');

const router = express.Router();

// Datenverzeichnis sicherstellen
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// DB-Datei absolut referenzieren
const dbFile = path.join(dataDir, 'db.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('SQLite open error:', err.message);
  } else {
    console.log('SQLite geöffnet:', dbFile);
  }
});

// Schema anlegen
db.serialize(() => {
  db.run("PRAGMA journal_mode=WAL;");
  db.run("CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY, title TEXT NOT NULL, link TEXT NOT NULL, image TEXT)");
});

// Alle Links abrufen (geschützt)
router.get('/links', requireAuth, (req, res) => {
  db.all("SELECT * FROM links", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Neuen Link erstellen (geschützt)
router.post('/links', requireAuth, (req, res) => {
  const { title, link, image } = req.body;
  if (!title || !link) {
    return res.status(400).json({ error: 'title und link sind erforderlich' });
  }
  db.run("INSERT INTO links (title, link, image) VALUES (?, ?, ?)",
    [title, link, image || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// Link löschen (geschützt)
router.delete('/links/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM links WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Link nicht gefunden' });
    }
    res.json({ success: true, deleted: this.changes });
  });
});

module.exports = router;