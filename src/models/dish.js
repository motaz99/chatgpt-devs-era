const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  // chef:{ type: Schema.Types.ObjectId, ref: 'Chef' },
  // userId: {
  //   type: String,
  //   required: true,
  // },
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
  rating: {
    type: String,
  },
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
