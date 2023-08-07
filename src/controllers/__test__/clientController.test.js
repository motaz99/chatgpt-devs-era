const clientController = require('../clientController');
const decodeJwtToken = require('../../helpers/decodeJwtToken');
const Client = require('../../models/client');
const Dish = require('../../models/dish');
const Chef = require('../../models/chef');

jest.mock('../../helpers/decodeJwtToken');
jest.mock('../../models/client');
jest.mock('../../models/chef');

const createMockReqRes = (reqBody = {}) => ({
  cookies: { jwt: 'mockToken' },
  body: reqBody,
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('createDish', () => {
  it('should create a new client successfully', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
      body: {
        address: 'something',
        contactNumber: 'something',
      },
    };

    const decodedToken = { userId: 'mockUserId' };
    const savedClient = {
      userId: decodedToken.userId,
      address: req.body.address,
      contactNumber: req.body.contactNumber,
    };

    decodeJwtToken.mockReturnValue(decodedToken);
    Client.findOne.mockResolvedValue(null);
    Client.create.mockResolvedValue(savedClient);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn(),
    };

    await clientController.createClient(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(Client.findOne).toHaveBeenCalledWith({
      userId: decodedToken.userId,
    });
    expect(Client.create).toHaveBeenCalledWith({
      userId: decodedToken.userId,
      address: req.body.address,
      contactNumber: req.body.contactNumber,
    });
    expect(res.redirect).toHaveBeenCalledWith('/api/clients/chefs');
  });

  it('should return an error if the client already exists', async () => {
    const req = createMockReqRes({
      address: 'Test Address',
      contactNumber: 'Test Contact Number',
    });

    const decodedToken = { userId: 'mockUserId' };
    const existingClient = { _id: 'existingClientId' };

    decodeJwtToken.mockReturnValue(decodedToken);
    Client.findOne.mockResolvedValue(existingClient);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.createClient(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Client already exists' });
  });
});

describe('getClient', () => {
  it('should return client information', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
    };

    const decodedToken = { userId: 'mockUserId' };
    const mockClient = { name: 'Test Client', address: 'Test Address' };

    decodeJwtToken.mockReturnValue(decodedToken);
    Client.findOne.mockResolvedValue(mockClient);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getClient(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(Client.findOne).toHaveBeenCalledWith({
      userId: decodedToken.userId,
    });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Client information page',
      data: mockClient,
    });
  });
});

describe('updateClient', () => {
  it('should update a client successfully', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
      body: {
        address: 'something',
        contactNumber: 'something',
      },
    };

    const decodedToken = { userId: 'mockUserId' };
    const updatedClientData = {
      address: 'something',
      contactNumber: 'something',
    };

    decodeJwtToken.mockReturnValue(decodedToken);
    Client.findOneAndUpdate.mockResolvedValue(updatedClientData);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.updateClient(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(Client.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: decodedToken.userId },
      req.body,
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Client object got updated',
      data: updatedClientData,
    });
  });

  it('should handle server error during update', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
      body: {
        // Provide updated client data here
      },
    };

    const decodedToken = { userId: 'mockUserId' };

    decodeJwtToken.mockReturnValue(decodedToken);
    Client.findOneAndUpdate.mockRejectedValue(new Error('Mock server error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.updateClient(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
  });
});

// describe('createFavoriteDish', () => {
//   // TEST createFavoriteDish
// });

describe('getFavoriteDishes', () => {
  it('should return favorite dishes array', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
    };

    const decodedToken = { userId: 'mockUserId' };
    const mockClient = { favoriteDishes: ['Dish1', 'Dish2'] };

    decodeJwtToken.mockReturnValue(decodedToken);
    Client.findOne.mockResolvedValue(mockClient);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getFavoriteDishes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(Client.findOne).toHaveBeenCalledWith({
      userId: decodedToken.userId,
    });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Favorite Dishes array',
      data: mockClient.favoriteDishes,
    });
  });

  it('should handle server error during retrieval', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
    };

    const decodedToken = { userId: 'mockUserId' };

    decodeJwtToken.mockReturnValue(decodedToken);
    Client.findOne.mockRejectedValue(new Error('Mock server error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getFavoriteDishes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
  });
});

// describe('deleteFavoriteDish', () => {
//   // testing deleteFavoriteDish
// });

// describe('getOrderHistory', () => {
//   describe('getOrderHistory', () => {
//     it('should return order history for the client', async () => {
//       const token = 'mocked-jwt-token';
//       const decodedToken = {
//         userId: 'mocked-user-id',
//       };

//       const client = {
//         orderHistory: [{ orderId: 'order-id-1' }, { orderId: 'order-id-2' }],
//       };

//       const req = {
//         cookies: {
//           jwt: token,
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       decodeJwtToken.mockReturnValue(decodedToken);
//       Client.findOne.mockResolvedValue(client);

//       await clientController.getOrderHistory(req, res);

//       expect(Client.findOne).toHaveBeenCalledWith({
//         userId: decodedToken.userId,
//       });
//       // expect(res.status).toHaveBeenCalledWith(200);
//       // expect(res.json).toHaveBeenCalledTimes(1);
//       // expect(res.json).toHaveBeenCalledWith({
//       //   orderHistory: client.orderHistory,
//       // });
//     });

//     it('should handle client not found', async () => {
//       const token = 'mocked-jwt-token';
//       const decodedToken = {
//         userId: 'mocked-user-id',
//       };

//       const req = {
//         cookies: {
//           jwt: token,
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       decodeJwtToken.mockReturnValue(decodedToken);
//       Client.findOne.mockResolvedValue(null);

//       await clientController.getOrderHistory(req, res);

//       expect(Client.findOne).toHaveBeenCalledTimes(1);
//       expect(res.status).toHaveBeenCalledTimes(1);
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledTimes(1);
//       //   expect(res.json).toHaveBeenCalledWith({ error: 'Client not found' });
//     });

//     it('should handle errors', async () => {
//       const token = 'mocked-jwt-token';
//       const decodedToken = {
//         userId: 'mocked-user-id',
//       };

//       const req = {
//         cookies: {
//           jwt: token,
//         },
//       };

//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       decodeJwtToken.mockReturnValue(decodedToken);
//       Client.findOne.mockRejectedValue(new Error('Mocked error'));

//       await clientController.getOrderHistory(req, res);

//       // expect(Client.findOne).toHaveBeenCalledTimes(1);
//       // expect(res.status).toHaveBeenCalledTimes(1);
//       // expect(res.status).toHaveBeenCalledWith(500);
//       // expect(res.json).toHaveBeenCalledTimes(1);
//       // expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
//     });
//   });
// });

describe('getChefs', () => {
  it('should return an array of available chefs', async () => {
    const chefs = [{ name: 'Chef 1' }, { name: 'Chef 2' }];

    Chef.find = jest.fn().mockResolvedValue(chefs);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getChefs(req, res);

    expect(Chef.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Array of available chefs',
      data: chefs,
    });
  });

  it('should return message for no chefs available', async () => {
    Chef.find = jest.fn().mockResolvedValue([]);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getChefs(req, res);

    expect(Chef.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No chefs available yet',
    });
  });

  it('should handle errors', async () => {
    const error = new Error('Mocked error');
    Chef.find = jest.fn().mockRejectedValue(error);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getChefs(req, res);

    expect(Chef.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      error: `Error while retrieving chefs: ${error.message}`,
    });
  });
});

// describe('getChefById',getChefs() => {
//   // testing getChefById
// });

// describe('dishesRatings',getChefs() => {
//   // testing dishesRatings
// });

// describe('getChefDishes',getChefs() => {
//   // testing getChefDishes
// });

// describe('searchDish',getChefs() => {
//   // testing searchDish
// });
