const clientController = require('../clientController');
const dishController = require('../dishController');
const decodeJwtToken = require('../../helpers/decodeJwtToken');
const Client = require('../../models/client');
const Dish = require('../../models/dish');

jest.mock('../../helpers/decodeJwtToken');
jest.mock('../../models/client');

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

// describe('deleteFavoriteDish', () => {
//   // testing deleteFavoriteDish
// });

// describe('getOrderHistory', () => {
//   // testing getOrderHistory
// });

// describe('getChefs',getChefs() => {
//   // testing getChefs
// });

// describe('getChefById', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return chef information by ID', async () => {
//     const req = {
//       params: { id: 'mockChefId' },
//     };

//     const mockChef = { name: 'Test Chef', specialty: 'Italian Cuisine' };

//     Chef.findById.mockResolvedValue(mockChef);

//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     await chefController.getChefById(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(Chef.findById).toHaveBeenCalledWith(req.params.id);
//     expect(res.json).toHaveBeenCalledWith(mockChef);
//   });
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

// describe('getChefDishes',getChefs() => {
//   // testing getChefDishes
// });

// describe('searchDish',getChefs() => {
//   // testing searchDish
// });
