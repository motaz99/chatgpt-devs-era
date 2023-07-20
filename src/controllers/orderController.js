const Order = require('../models/order');
const Client = require('../models/client');
const decodeJwtToken = require('../helpers/decodeJwtToken');

exports.postOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const client = await Client.findOne({ userId: decodedToken.userId });

    if (!client) {
      throw new Error('Client not found');
    }

    client.orderHistory.push(order._id);
    await client.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the order' });
  }
};
