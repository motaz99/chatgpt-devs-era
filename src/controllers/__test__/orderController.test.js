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

describe('postOrder', () => {
  const client = {
    _id: 'client12345',
    userId: 'user12345',
  };

  const dish = {
    _id: 'dish12345',
    chefId: 'chef12345',
  };

  const decodedToken = {
    userId: 'user12345',
    firstname: 'Test',
    lastname: 'Test',
  };

  const expectedOrderData = {
    clientId: client._id,
    dishId: dish._id,
    chefId: dish.chefId,
    quantity: 2,
  };

  const req = {
    body: {
      dishId: dish._id,
      quantity: 2,
    },
    cookies: {
      jwt: 'token123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    Client.findOne.mockClear();
    Dish.findById.mockClear();
    Order.create.mockClear();
    decodeJwtToken.mockReturnValue(decodedToken);
    sendEmail.mockResolvedValue();
  });

  //   it('should create a new order', async () => {
  //     Client.findOne.mockResolvedValue(client);
  //     Dish.findById.mockResolvedValue(dish);
  //     Order.create.mockResolvedValue(expectedOrderData);

  //     await orderController.postOrder(req, res);

  //     expect(Client.findOne).toHaveBeenCalledTimes(1);
  //     expect(Dish.findById).toHaveBeenCalledTimes(1);
  //     expect(Order.create).toHaveBeenCalledTimes(1);
  //     // expect(sendEmail).toHaveBeenCalledTimes(1);
  //     expect(res.status).toHaveBeenCalledWith(201);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: 'Your order has been sent successfully',
  //       data: expectedOrderData,
  //     });
  //   });

  it('should handle error', async () => {
    Client.findOne.mockResolvedValue(client);
    Dish.findById.mockResolvedValue(dish);
    Order.create.mockRejectedValue(new Error('Database error'));

    await orderController.postOrder(req, res);

    expect(Client.findOne).toHaveBeenCalledTimes(1);
    expect(Dish.findById).toHaveBeenCalledTimes(1);
    expect(Order.create).toHaveBeenCalledTimes(1);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to create the order',
    });
  });
});

describe('getChefOrders', () => {
  const chef = {
    _id: 'chef12345',
  };

  const decodedToken = {
    userId: 'user12345',
  };

  const chefOrders = [
    {
      _id: 'order1',
      clientId: 'client1',
      dishId: 'dish1',
      quantity: 2,
    },
    {
      _id: 'order2',
      clientId: 'client2',
      dishId: 'dish2',
      quantity: 3,
    },
  ];

  const req = {
    cookies: {
      jwt: 'token123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    Chef.findOne.mockClear();
    Order.find.mockClear();
    decodeJwtToken.mockReturnValue(decodedToken);
  });

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
