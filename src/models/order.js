const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
  /* client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  }, */
  items: [
    {
      dish: {
        type: Schema.Types.ObjectId,
        ref: 'Dish',
      },
      /* chef: {
      type: Schema.Types.ObjectId,
      ref: 'Chef'
    }, */
      quantity: {
        type: Number,
        min: 1,
      },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'inProgress', 'completed'],
    default: 'pending',
  },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
