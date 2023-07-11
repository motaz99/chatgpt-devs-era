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
    // Now this controller is sending back the updated version of the User object
    // but in the feature it should redirect the user to a form to complete his info
    // So he will either be chef or client after this.
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = decideRole;
