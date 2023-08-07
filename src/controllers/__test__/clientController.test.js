const clientController = require('../clientController');
const dishController = require('../dishController');
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

  it('should rate a dish successfully', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
      params: { id: 'mockDishId' },
      body: {
        rating: 4,
      },
    };

    const decodedToken = { userId: 'mockUserId' };
    const dish = {
      _id: 'mockDishId',
      ratings: [],
      save: jest.fn(), // Mock the save function
    };

    // Use jest.spyOn() to mock the Dish model's findById method
    const findByIdMock = jest.spyOn(Dish, 'findById');
    findByIdMock.mockResolvedValue(dish);

    decodeJwtToken.mockReturnValue(decodedToken);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.dishesRatings(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(findByIdMock).toHaveBeenCalledWith('mockDishId');
    expect(res.json).toHaveBeenCalledWith('Dish Rated Successfully');
  });
});

// describe('getOrderHistory', () => {
//   // testing getOrderHistory
// });

// describe('getChefs',getChefs() => {
//   // testing getChefs
// });

// describe('getChefById', () => {
//   // testing getChefById
// });

describe('dishesRatings', () => {
  it('should rate a dish successfully', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
      params: { id: 'mockDishId' },
      body: {
        rating: 4,
      },
    };

    const decodedToken = { userId: 'mockUserId' };
    const dish = {
      _id: 'mockDishId',
      ratings: [],
      save: jest.fn(),
    };

    const findByIdMock = jest.spyOn(Dish, 'findById');
    findByIdMock.mockResolvedValue(dish);

    decodeJwtToken.mockReturnValue(decodedToken);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.dishesRatings(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(findByIdMock).toHaveBeenCalledWith('mockDishId');
    expect(res.json).toHaveBeenCalledWith('Dish Rated Successfully');
  });
});

describe('getChefDishes', () => {
  it('should return dishes related to the chef when the chef has dishes', async () => {
    const req = {
      params: { id: 'mockChefUserId' },
    };

    const chefDishes = [
      {
        _id: 'mockDishId1',
        name: 'Mock Dish 1',
        description: 'Mock Description 1',
        price: '10',
        rating: 4.5,
        userId: 'mockChefUserId',
      },
      {
        _id: 'mockDishId2',
        name: 'Mock Dish 2',
        description: 'Mock Description 2',
        price: '15',
        rating: 3.8,
        userId: 'mockChefUserId',
      },
    ];

    Dish.find.mockResolvedValue(chefDishes);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getChefDishes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dishes that are related to this chef',
      data: chefDishes,
    });
  });

  it('should return a message when the chef has no dishes', async () => {
    const req = {
      params: { id: 'mockChefUserId' },
    };

    Dish.find.mockResolvedValue([]);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getChefDishes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dishes that are related to this chef',
      data: "This chef didn't add dishes yet",
    });
  });

  it('should return an error when there is a server error', async () => {
    const req = {
      params: { id: 'mockChefUserId' },
    };

    Dish.find.mockRejectedValue(new Error('Mocked error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.getChefDishes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Mocked error' });
  });
});

describe('searchDish', () => {
  it('should return dishes matching the search value', async () => {
    const req = {
      body: { value: 'Mock Dish' },
    };

    const dishes = [
      {
        _id: 'mockDishId1',
        name: 'Mock Dish 1',
        description: 'Mock Description 1',
        price: '10',
        rating: 4.5,
        userId: 'mockChefUserId',
      },
      {
        _id: 'mockDishId2',
        name: 'Mock Dish 2',
        description: 'Mock Description 2',
        price: '15',
        rating: 3.8,
        userId: 'mockChefUserId',
      },
    ];

    Dish.find.mockResolvedValue(dishes);
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await clientController.searchDish(req, res);
    expect(res.json).toHaveBeenCalledWith(dishes);
  });

  it('should return a message when no dishes match the search value', async () => {
    const req = {
      body: { value: 'Non-existing Dish' },
    };

    Dish.find.mockResolvedValue([]);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.searchDish(req, res);

    expect(res.json).toHaveBeenCalledWith('There is no such a dish name...');
  });

  it('should throw an error when no search value is provided', async () => {
    const req = {
      body: { value: '' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await expect(clientController.searchDish(req, res)).rejects.toThrow(
      'Please write a dish name to search for.'
    );
  });

  it('should return an error when there is a server error', async () => {
    const req = {
      body: { value: 'Mock Dish' },
    };

    Dish.find.mockRejectedValue(new Error('Mocked error'));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await clientController.searchDish(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while searching for dishes.',
    });
  });
});
