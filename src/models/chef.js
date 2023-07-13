const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  // userId: {
  //   type: String,
  //   required: true,
  // },
  restaurant: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  closingHours: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;
