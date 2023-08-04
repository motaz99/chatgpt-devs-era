const generateToken = require('../helpers/generateToken');
const User = require('../models/User');

const googleCallback = async (req, res) => {
  const { user } = req;

  try {
    const currentUser = await User.findOne({
      providerId: user.providerId,
    });

    if (currentUser) {
      const token = generateToken(currentUser);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
      });

      if (currentUser.role === 'chef') {
        res.redirect('/api/chef/me');
      }

      if (currentUser.role === 'client') {
        res.redirect('/api/clients/chefs');
      }

      if (currentUser.role === 'user') {
        res.json({
          message: `You haven't chosen your role yet`,
          method: `Do PUT request on '/api/role' and send the role you want by sending for example "role": "client"`,
        });
      }
    }
    const newUser = await User.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: null,
      provider: user.provider,
      providerId: user.providerId,
      profilePicture: user.providerPicture,
      type: 'google-user',
      role: 'user',
    });

    const token = generateToken(newUser);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: `You have to pick you role on '/api/role'`,
      method: `Do PUT request on '/api/role' and send the role you want by sending for example "role": "client"`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt');
  res.end();
};

module.exports = { googleCallback, logout };
