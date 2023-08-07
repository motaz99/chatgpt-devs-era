const Client = require('../../models/client');
const Order = require('../../models/order');
const Chef = require('../../models/chef');
const Dish = require('../../models/dish');
const orderController = require('../orderController');
const decodeJwtToken = require('../../helpers/decodeJwtToken');
const sendEmail = require('../../helpers/sendEmail');

jest.mock('../../models/chef');
jest.mock('../../models/order');
jest.mock('../../models/client');
jest.mock('../../models/dish');
jest.mock('../../helpers/decodeJwtToken');
jest.mock('../../helpers/sendEmail');

afterEach(() => {
  jest.clearAllMocks();
});

describe('postOrder', () => {
  it('should create a new order', async () => {
    const req = {
      body: {
        dishId: 'mocked-dish-id',
        quantity: 2,
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const decodedToken = {
      userId: 'mocked-user-id',
      firstname: 'Mock',
      lastname: 'User',
    };

    decodeJwtToken.mockReturnValue(decodedToken);

    const mockClient = {
      _id: 'mocked-client-id',
      userId: 'mocked-user-id',
    };

    const mockDish = {
      _id: 'mocked-dish-id',
      chefId: 'mocked-chef-id',
    };

    const mockChef = {
      _id: 'mocked-chef-id',
      userId: {
        email: 'chef@example.com',
      },
    };

    Client.findOne.mockResolvedValue(mockClient);
    Dish.findById.mockResolvedValue(mockDish);
    Chef.findById.mockResolvedValue(mockChef);

    const mockOrder = {
      clientId: mockClient._id,
      chefId: mockDish.chefId,
      dishId: mockDish._id,
      quantity: req.body.quantity,
    };

    Order.create.mockResolvedValue(mockOrder);

    sendEmail.mockResolvedValue();

    await orderController.postOrder(req, res);

    expect(Client.findOne).toHaveBeenCalledTimes(1);
    expect(Dish.findById).toHaveBeenCalledTimes(1);
    expect(Order.create).toHaveBeenCalledTimes(1);
    expect(Chef.findById).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      mockChef.userId.email,
      'New order',
      `You have new order by '${decodedToken.firstname} ${decodedToken.lastname}'`
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Your order has been sent successfully',
      data: mockOrder,
    });
  });

  it('should handle errors', async () => {
    const req = {
      body: {
        dishId: 'mocked-dish-id',
        quantity: 2,
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    decodeJwtToken.mockReturnValue({
      userId: 'mocked-user-id',
      firstname: 'Mock',
      lastname: 'User',
    });

    Client.findOne.mockRejectedValue(new Error('Mocked error'));

    await orderController.postOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to create the order',
    });
  });
});

describe('getChefOrders', () => {
  const chef = {
    _id: 'mocked-chef-id',
  };

  const decodedToken = {
    userId: 'mocked-user-id',
  };

  const chefOrders = [
    {
      _id: 'mocked-order-id',
      clientId: 'mocked-client-id',
      dishId: 'mocked-dish-id',
      quantity: 2,
    },
    {
      _id: 'mocked-order-id',
      clientId: 'mocked-client-id',
      dishId: 'mocked-dish-id',
      quantity: 1,
    },
  ];

  const req = {
    cookies: {
      jwt: 'mocked-jwt-token',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  decodeJwtToken.mockReturnValue(decodedToken);

  it('should retrieve chef orders', async () => {
    Chef.findOne.mockResolvedValue(chef);
    Order.find.mockResolvedValue(chefOrders);

    await orderController.getChefOrders(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(Order.find).toHaveBeenCalledTimes(1);
    expect(Order.find).toHaveBeenCalledWith({ chefId: chef._id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Here are your orders',
      data: chefOrders,
    });
  });

  it('should handle no orders', async () => {
    Chef.findOne.mockResolvedValue(chef);
    Order.find.mockResolvedValue([]);

    await orderController.getChefOrders(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(Order.find).toHaveBeenCalledTimes(1);
    expect(Order.find).toHaveBeenCalledWith({ chefId: chef._id });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'You have no orders yet',
    });
  });

  it('should handle error', async () => {
    Chef.findOne.mockRejectedValue(new Error('Database error'));

    await orderController.getChefOrders(req, res);

    expect(Chef.findOne).toHaveBeenCalledTimes(1);
    expect(Order.find).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve chef orders',
    });
  });
});

describe('chefUpdateOrderStatus', () => {
  it('should delete order the order successfully when new status is cancel', async () => {
    const req = {
      body: {
        newStatus: 'cancel',
        orderId: 'mocked-order-id',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockClientUser = {
      _id: 'mocked-client-id',
      userId: {
        email: 'client@example.com',
      },
    };

    const mockOrder = {
      _id: 'mocked-order-id',
      clientId: 'mocked-client-id',
      chefId: 'mocked-chef-id',
      dishId: 'mocked-dish-id',
      status: 'pending',
    };

    Client.findById.mockResolvedValue(mockClientUser);
    Order.findById.mockResolvedValue(mockOrder);
    Order.findByIdAndDelete.mockResolvedValue(mockOrder);
    sendEmail.mockResolvedValue();

    await orderController.chefUpdateOrderStatus(req, res);

    expect(Client.findById).toHaveBeenCalledTimes(1);
    expect(Order.findById).toHaveBeenCalledTimes(1);
    expect(Order.findByIdAndDelete).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      mockClientUser.userId.email,
      'Order status update',
      'Your order has been canceled'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order cancelled successfully',
    });
  });

  it('should update order status successfully when new status is not cancel', async () => {
    const req = {
      body: {
        newStatus: 'newStatusValue',
        orderId: 'mocked-order-id',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockClientUser = {
      _id: 'mocked-client-id',
      userId: {
        email: 'client@example.com',
      },
    };

    const mockChef = {
      _id: 'mocked-chef-id',
      userId: {
        email: 'chef@example.com',
      },
    };

    const mockOrder = {
      _id: 'mocked-order-id',
      clientId: 'mocked-client-id',
      chefId: 'mocked-chef-id',
      dishId: {
        name: 'mocked-dish-name',
      },
      status: 'pending',
      save: jest.fn(),
    };

    const decodedToken = {
      userId: 'mocked-decoded-user-id',
    };

    decodeJwtToken.mockReturnValue(decodedToken);

    Client.findById.mockResolvedValue(mockClientUser);
    Order.findById.mockResolvedValue(mockOrder);
    Chef.findOne.mockResolvedValue(mockChef);
    sendEmail.mockResolvedValue();

    await orderController.chefUpdateOrderStatus(req, res);

    expect(Client.findById).toHaveBeenCalledTimes(1);
    expect(Order.findById).toHaveBeenCalledTimes(1);
    expect(Chef.findOne).toHaveBeenCalledWith({
      userId: 'mocked-decoded-user-id',
    });
    expect(mockOrder.save).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith(
      mockClientUser.userId.email,
      'Order status update',
      `Your order '${mockOrder.dishId.name}' is now in ${mockOrder.status} status`
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order status updated successfully',
      data: mockOrder,
    });
  });

  it('should handle authorization error', async () => {
    const req = {
      body: {
        newStatus: 'newStatusValue',
        orderId: 'mocked-order-id',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockOrder = {
      _id: 'mocked-order-id',
      clientId: 'mocked-client-id',
      chefId: 'different-chef-id',
      dishId: 'mocked-dish-id',
      status: 'pending',
    };

    const decodedToken = {
      userId: 'mocked-decoded-user-id',
    };

    decodeJwtToken.mockReturnValue(decodedToken);

    Order.findById.mockResolvedValue(mockOrder);

    await orderController.chefUpdateOrderStatus(req, res);

    expect(Order.findById).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to update order status',
      error: 'You are not authorized to update this order',
    });
  });

  it('should handle other errors', async () => {
    const req = {
      body: {
        newStatus: 'newStatusValue',
        orderId: 'mocked-order-id',
      },
      cookies: {
        jwt: 'mocked-jwt-token',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockError = new Error('Mocked error message');

    Order.findById.mockRejectedValue(mockError);

    await orderController.chefUpdateOrderStatus(req, res);

    expect(Order.findById).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to update order status',
      error: 'Mocked error message',
    });
  });
});

describe('clientCancelOrder', () => {
  it('should cancel the order successfully', async () => {
    const orderId = 'mocked-order-id';
    const token = 'mocked-jwt-token';
    const decodedToken = {
      userId: 'mocked-user-id',
      firstname: 'Mock',
      lastname: 'User',
    };

    const req = {
      cookies: {
        jwt: token,
      },
      params: {
        id: orderId,
      },
    };

    const order = {
      _id: orderId,
      status: 'pending',
      chefId: {
        populate: jest.fn(() => ({
          userId: {
            email: 'chef@example.com',
          },
        })),
      },
      dishId: {
        name: 'Mock Dish',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    decodeJwtToken.mockReturnValue(decodedToken);

    Order.findById.mockResolvedValue(order);
    Order.findByIdAndDelete.mockResolvedValue(order);

    sendEmail.mockResolvedValue();

    await orderController.clientCancelOrder(req, res);

    expect(Order.findById).toHaveBeenCalledTimes(1);
    expect(Order.findByIdAndDelete).toHaveBeenCalledTimes(1);
    expect(order.chefId.populate).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith(
      order.chefId.populate().userId.email,
      'Order status update',
      `The client '${decodedToken.firstname} ${decodedToken.lastname}' has been canceled his order with the name '${order.dishId.name}'`
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Order cancelled successfully',
    });
  });

  it('should handle errors', async () => {
    const orderId = 'mocked-order-id';
    const token = 'mocked-jwt-token';

    const req = {
      cookies: {
        jwt: token,
      },
      params: {
        id: orderId,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Order.findById.mockRejectedValue(new Error('Mocked Error'));

    await orderController.clientCancelOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to cancel order',
      error: 'Mocked Error',
    });
  });
});
