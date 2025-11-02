const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const router = express.Router();

// 1) Datenverzeichnis sicherstellen (absolut zu dieser Datei)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 2) DB-Datei absolut referenzieren
const dbFile = path.join(dataDir, 'db.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('SQLite open error:', err.message);
  } else {
    console.log('SQLite geöffnet:', dbFile);
  }
});

// 3) Schema anlegen (optional: WAL für Stabilität)
db.serialize(() => {
  db.run("PRAGMA journal_mode=WAL;");
  db.run("CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY, title TEXT NOT NULL, link TEXT NOT NULL, image TEXT)");
});

// 4) Routen

// Alle Links abrufen
router.get('/links', (req, res) => {
  db.all("SELECT * FROM links", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Neuen Link erstellen
router.post('/links', (req, res) => {
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

// Link löschen
router.delete('/links/:id', (req, res) => {
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