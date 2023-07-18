const decodeJwtToken = require('../helpers/decodeJwtToken');

const verifyChef = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    if (decodedToken.role !== 'chef') {
      throw new Error('Unauthorized role');
    }
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
const verifyClient = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    if (decodedToken.role !== 'client') {
      throw new Error('Unauthorized role');
    }
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  verifyChef,
  verifyClient,
};
