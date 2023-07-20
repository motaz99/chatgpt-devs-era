const express = require('express');
require('dotenv').config();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const passportGoogleSetup = require('./passport-configuration/passport-google-setup');
const swaggerOptions = require('./swagger/swagger');
const db = require('./db');
const apiRoutes = require('./routes');

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.NODE_LOCAL_PORT;

app.get('/api-docs.json', (req, res) => {
  res.json(swaggerJsdoc(swaggerOptions));
});

app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions, { explorer: true })
);

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  db();
});
