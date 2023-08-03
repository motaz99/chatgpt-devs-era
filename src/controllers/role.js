const decodeJwtToken = require('../helpers/decodeJwtToken');
const User = require('../models/User');

const decideRole = async (req, res) => {
  try {
    const { role } = req.body;
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const updatedUser = await User.findOneAndUpdate(
      { _id: decodedToken.userId },
      { role },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }
    if (role === 'chef') {
      res.json({
        message: `Role updated successfully, now you need to fill the ${role} information`,
        method: `Do POST request on '/api/chef' and fill your ${role} information`,
        exampleData: {
          restaurant: 'Test',
          location: 'location',
          openingHours: '9AM',
          closingHours: '12AM',
          contactNumber: '+2343421',
          description: 'test',
        },
      });
    }

    if (role === 'client') {
      res.json({
        message: `Role updated successfully, now you need to fill the ${role} information`,
        method: `Do POST request on '/api/clients' and fill your ${role} information`,
        exampleData: {
          address: 'address',
          contactNumber: '+24322334',
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = decideRole;
