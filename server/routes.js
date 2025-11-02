
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./server/db.sqlite');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY, title TEXT, link TEXT, image TEXT)");
});

router.get('/links', (req, res) => {
  db.all("SELECT * FROM links", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/links', (req, res) => {
  const { title, link, image } = req.body;
  db.run("INSERT INTO links (title, link, image) VALUES (?, ?, ?)", [title, link, image], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

module.exports = router;
