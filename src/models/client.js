const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  favoriteDishes: [{ type: String }],
  // orderHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Order'}],
  // cart: [{
  //     dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
  //     quantity: { type: Number, min: 1 }
  // }]
});

module.exports = mongoose.model('Client', clientSchema);
