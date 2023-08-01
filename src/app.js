const path = require('path');
const express = require('express');
require('dotenv').config();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const passportGoogleSetup = require('./passport-configuration/passport-google-setup');
const db = require('./db');
const apiRoutes = require('./routes');

const app = express();

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'views')));
const port = process.env.NODE_LOCAL_PORT;

app.use('/api', apiRoutes);
app.get('/home-page', (req, res) => {
  res.render(`${__dirname}/views/index.ejs`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  db();
});
