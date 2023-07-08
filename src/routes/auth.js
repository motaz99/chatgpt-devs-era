const express = require('express');

const router = express.Router();
const passport = require('passport');

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/facebook' }),
  (req, res) => {
    if (req.user) {
      const { displayName, email } = req.user;

      res.status(200).json({ displayName, email });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
);

// router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/facebook');
// });

module.exports = router;
