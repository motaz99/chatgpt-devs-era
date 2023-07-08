const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./db');
const apiRoutes = require('./routes/authRoutes');

const app = express();

const port = process.env.NODE_LOCAL_PORT;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  db();
});
