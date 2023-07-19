const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  },
  provider: {
    type: String,
    required: false,
  },
  providerId: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ['google-user', 'normal-user'],
  },
  role: {
    type: String,
    default: 'user',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
