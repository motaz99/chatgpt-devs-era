const decodeJwtToken = require('../helpers/decodeJwtToken');
const Chef = require('../models/chef');
const Client = require('../models/client');
const Dish = require('../models/dish');
const Order = require('../models/order');

exports.postOrder = async (req, res) => {
  try {
    const { dishId, quantity } = req.body;

    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const client = await Client.findOne({ userId: decodedToken.userId });
    const dish = await Dish.findById(dishId);

    const order = await Order.create({
      clientId: client._id,
      dishId,
      chefId: dish.chefId,
      quantity,
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the order' });
  }
};

exports.getChefOrders = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const chef = await Chef.findOne({ userId: decodedToken.userId });

    const chefOrders = await Order.find({ chefId: chef._id });

    if (chefOrders.length === 0) {
      res.status(200).json({ message: 'You have no orders yet' });
    }

    res.status(200).json({ message: 'Here are your orders', data: chefOrders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chef orders' });
  }
};
