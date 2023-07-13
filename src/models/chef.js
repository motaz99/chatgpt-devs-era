const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  // userId: {
  //   type: String,
  //   required: true,
  // },
  Restaurant: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  OpeningHours: {
    type: String,
    required: true,
  },
  ClosingHours: {
    type: String,
    required: true,
  },
  ContactNumber: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
});

const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;
