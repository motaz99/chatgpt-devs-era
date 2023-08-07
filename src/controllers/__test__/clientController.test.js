const clientController = require('../clientController');
const decodeJwtToken = require('../../helpers/decodeJwtToken');
const Client = require('../../models/client');
const Dish = require('../../models/dish');

jest.mock('../../helpers/decodeJwtToken');
jest.mock('../../models/client');
jest.mock('../../models/dish');

const createMockReqRes = (reqBody = {}) => ({
  cookies: { jwt: 'mockToken' },
  body: reqBody,
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

/// /////////////////////////////////////////////////////////////////////////////////////////////

describe('createFavoriteDish', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error when an invalid dish ID is provided', async () => {
    const mockedUserId = 'mocked-user-id';
    const mockedClient = { userId: mockedUserId, favoriteDishes: [] };

    Client.findOne.mockResolvedValue(mockedClient);
    Dish.findById.mockResolvedValue(null);

    const req = {
      body: { dishId: 'invalid-dish-id' },
      cookies: { jwt: 'mocked-jwt-token' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.createFavoriteDish(req, res);

    expect(mockedClient.favoriteDishes).toEqual([]);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dish not found' });
  });

  it('should return an error when the client does not exist', async () => {
    Client.findOne.mockResolvedValue(null);

    const req = {
      body: { dishId: 'mocked-dish-id' },
      cookies: { jwt: 'mocked-jwt-token' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.createFavoriteDish(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Client not found' });
  });
});

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

// describe('getOrderHistory', () => {
//   // testing getOrderHistory
// });

// describe('getChefs',getChefs() => {
//   // testing getChefs
// });

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
