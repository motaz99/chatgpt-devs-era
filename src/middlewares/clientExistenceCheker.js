const decodeJwtToken = require('../helpers/decodeJwtToken');
const Client = require('../models/client');

const isUserCreatedClient = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const client = await Client.findOne({ userId: decodedToken.userId });

    if (!client) {
      throw new Error(
        'You need to fill your client info in order to be able to do this action'
      );
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

module.exports = isUserCreatedClient;
