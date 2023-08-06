const decodeJwtToken = require('../helpers/decodeJwtToken');
const sendEmail = require('../helpers/sendEmail');
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

    const userChef = await Chef.findById(order.chefId);
    // .populate('userId')
    // .exec();

    await sendEmail(
      userChef.userId.email,
      'New order',
      `You have new order by '${decodedToken.firstname} ${decodedToken.lastname}'`
    );
    res
      .status(201)
      .json({ message: 'Your order has been sent successfully', data: order });
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

exports.chefUpdateOrderStatus = async (req, res) => {
  try {
    const { newStatus, orderId } = req.body;
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const order = await Order.findById(orderId); // .populate('dishId');
    const clientUserDetails = await Client.findById(order.clientId);
    // .populate('userId')
    // .exec();
    if (newStatus === 'cancel') {
      if (!order) {
        throw new Error('Order not found');
      }

      await Order.findByIdAndDelete(orderId);

      await sendEmail(
        clientUserDetails.userId.email,
        'Order status update',
        `Your order has been canceled`
      );

      res.status(200).json({ message: 'Order cancelled successfully' });
    }

    const chef = await Chef.findOne({ userId: decodedToken.userId });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.chefId.toString() !== chef._id.toString()) {
      throw new Error('You are not authorized to update this order');
    }

    order.status = newStatus;
    await order.save();

    await sendEmail(
      clientUserDetails.userId.email,
      'Order status update',
      `Your order '${order.dishId.name}' is now in ${order.status} status`
    );
    res
      .status(200)
      .json({ message: 'Order status updated successfully', data: order });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update order status', error: error.message });
  }
};

exports.clientCancelOrder = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    // .populate('chefId')
    // .populate('dishId')
    // .exec();
    if (!order) {
      throw new Error('Order not found');
    }
    const chefDetails = await order.chefId.populate('userId');
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'pending') {
      throw new Error(
        'Order cannot be cancelled because the chef started cooking your order'
      );
    }

    await Order.findByIdAndDelete(orderId);

    await sendEmail(
      chefDetails.userId.email,
      'Order status update',
      `The client '${decodedToken.firstname} ${decodedToken.lastname}' has been canceled his order with the name '${order.dishId.name}'`
    );

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to cancel order', error: error.message });
  }
};
