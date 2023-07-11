const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  provider: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    unique: true,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
});

module.exports = mongoose.model('GoogleUsers', userSchema);
