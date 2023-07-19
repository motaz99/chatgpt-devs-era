const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  dishId: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
  },
  chefId: {
    type: Schema.Types.ObjectId,
    ref: 'Chef',
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'inProgress', 'rejected', 'onTheWay', 'completed'],
    default: 'pending',
  },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
