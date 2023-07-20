const decodeJwtToken = require('../helpers/decodeJwtToken');
const Chef = require('../models/chef');

const isUserCreatedChef = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const chef = await Chef.findOne({ userId: decodedToken.userId });

    if (!chef) {
      throw new Error(
        'You need to fill your chef info in order to be able to do this action'
      );
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

module.exports = isUserCreatedChef;
