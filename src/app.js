const express = require('express');
require('dotenv').config();
const passport = require('passport');
const db = require('./db');
const apiRoutes = require('./routes');
const passportFacebook = require('./passport-configuration/passport-facebook');

const app = express();
const port = process.env.NODE_LOCAL_PORT;

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  db();
});
