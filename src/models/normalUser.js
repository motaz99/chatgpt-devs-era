const mongoose = require('mongoose');

const normalUserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    required: true,
  },
});

const NormalUser = mongoose.model('NormalUser', normalUserSchema);

module.exports = NormalUser;
