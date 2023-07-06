const User = require('../models/User');

const decideRole = async (req, res) => {
  try {
    const { providerId, role } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { providerId },
      { role },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = decideRole;
