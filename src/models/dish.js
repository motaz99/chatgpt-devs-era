const mongoose = require('mongoose');

// Define the Dish schema
const dishSchema = new mongoose.Schema({
  // chef:{ type: Schema.Types.ObjectId, ref: 'Chef' },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  /* picture: {
    type: String,
    required: true,
  }, */
  rating: String,
});

// Create a Dish model from the schema
const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
