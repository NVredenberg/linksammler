const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
  console.log('Backend läuft auf Port 3000');
});
