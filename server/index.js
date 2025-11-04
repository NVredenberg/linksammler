const express = require('express');
const cors = require('cors');
const session = require('express-session');
const routes = require('./routes');
const authRoutes = require('./authRoutes');

const app = express();

// CORS konfigurieren
app.use(cors({
  origin: true,
  credentials: true
}));

// Session-Middleware
app.use(session({
  secret: 'linksammler-secret-' + Math.random().toString(36),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Bei HTTPS auf true setzen
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 Stunden
  }
}));

// Body-Parser mit erhöhtem Limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routen
app.use('/api/auth', authRoutes);
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Backend läuft auf Port 3000');
});