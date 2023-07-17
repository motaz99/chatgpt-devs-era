const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      type: user.type,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  );

  return token;
};

module.exports = generateToken;
