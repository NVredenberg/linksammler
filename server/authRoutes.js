const express = require('express');
const { setPassword, verifyPassword, isPasswordSet } = require('./auth');

const router = express.Router();

// Prüfen ob Passwort bereits gesetzt wurde
router.get('/status', async (req, res) => {
  try {
    const passwordSet = await isPasswordSet();
    res.json({ 
      passwordSet,
      authenticated: req.session && req.session.authenticated 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Passwort initial setzen
router.post('/setup', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        error: 'Passwort muss mindestens 6 Zeichen lang sein' 
      });
    }
    
    await setPassword(password);
    req.session.authenticated = true;
    res.json({ success: true, message: 'Passwort erfolgreich gesetzt' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Passwort erforderlich' });
    }
    
    const valid = await verifyPassword(password);
    
    if (valid) {
      req.session.authenticated = true;
      res.json({ success: true, message: 'Login erfolgreich' });
    } else {
      res.status(401).json({ error: 'Falsches Passwort' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout fehlgeschlagen' });
    }
    res.json({ success: true, message: 'Logout erfolgreich' });
  });
});

module.exports = router;