const { check } = require('express-validator');

const registrationValidators = {
  namesValidator: (name) =>
    check(name)
      .trim()
      .notEmpty()
      .withMessage(`${name} should not be empty`)
      .isLength({ min: 2 })
      .withMessage(`${name} must be at least 4 characters long`)
      .custom((value) => !/\s/.test(value))
      .withMessage(`${name} should not include spaces`)
      .trim(),
  validateEmail: (email) =>
    check(email)
      .notEmpty()
      .withMessage('Email should not be empty')
      .isEmail()
      .withMessage('Invalid email'),
  validatePassword: (password) =>
    check(password)
      .notEmpty()
      .withMessage('Password should not be empty')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/)
      .withMessage('Password must contain a number, uppercase and lowercase'),
};

module.exports = { registrationValidators };
