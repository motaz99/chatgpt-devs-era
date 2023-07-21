const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  ratings: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: false, min: 1, max: 5 },
        _id: false, // -----------------------------------------------> we won't need an Id here
      },
    ],
    default: [],
  },
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
