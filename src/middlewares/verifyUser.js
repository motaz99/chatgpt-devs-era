const jwt = require('jsonwebtoken');

const jwtChecker = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error });
  }
};

module.exports = jwtChecker;
