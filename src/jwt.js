const { sign, verify } = require('jsonwebtoken');
require('dotenv').config();

// creates a JWT token
const createTokens = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id, role: user.role },
    process.env.JWT_SECRET
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  // checking if any related token is exist
  const accessToken = req.cookies['access-token'];

  if (!accessToken)
    res
      .status(400)
      .json({ error: 'User not Authenticated, you need to login.' });

  try {
    // verify the token
    const validToken = verify(accessToken, process.env.JWT_SECRET);

    if (validToken) {
      req.authenticated = true;
      req.user = validToken;
      next();
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = { createTokens, validateToken };
