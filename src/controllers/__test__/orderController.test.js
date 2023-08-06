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
