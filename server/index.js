const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());

// Erhöhe das Body-Limit für große Base64-Bilder
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', routes);

app.listen(3000, () => {
  console.log('Backend läuft auf Port 3000');
});