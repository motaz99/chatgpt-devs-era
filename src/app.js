const express = require('express');
require('dotenv').config();
const db = require('./db');
const apiRoutes = require('./routes');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  db();
});
