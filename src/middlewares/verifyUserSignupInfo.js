const { validationResult } = require('express-validator');

const verifyUserSignupInfo = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new Error(errorMessages.join(', '));
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = verifyUserSignupInfo;
