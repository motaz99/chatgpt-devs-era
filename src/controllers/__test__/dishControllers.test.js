const dishController = require('../dishController');
const decodeJwtToken = require('../../helpers/decodeJwtToken');
const Chef = require('../../models/chef');
const Dish = require('../../models/dish');

// Mock the required dependencies
jest.mock('../../helpers/decodeJwtToken');
jest.mock('../../models/chef');
jest.mock('../../models/dish');

// Helper function to mock request and response objects
const createMockReqRes = (reqBody = {}) => ({
  cookies: { jwt: 'mockToken' },
  body: reqBody,
});

describe('createDish', () => {
  it('should create a new dish successfully', async () => {
    // Mock the necessary data for the test
    const req = {
      cookies: { jwt: 'mockToken' },
      body: {
        name: 'Test Dish',
        description: 'Test Description',
        price: '10',
        rating: 4,
      },
    };

    const decodedToken = { userId: 'mockUserId' };
    const chef = { _id: 'mockChefId' };
    const dish = null;
    const savedDish = {
      _id: 'mockDishId',
      chefId: 'mockChefId',
      userId: 'mockUserId',
      name: 'Test Dish',
      description: 'Test Description',
      price: '10',
      rating: 4,
    };

    // Mock the necessary functions
    decodeJwtToken.mockReturnValue(decodedToken); // Fix the mockReturnValue
    Chef.findOne.mockResolvedValue(chef);
    Dish.findOne.mockResolvedValue(dish);
    Dish.prototype.save.mockResolvedValue(savedDish);

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.createDish(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedDish);
  });

  it('should return an error if the dish already exists', async () => {
    // Mock the necessary data for the test
    const req = createMockReqRes({
      name: 'Test Dish',
      description: 'Test Description',
      price: '10',
      rating: 4,
    });
    const chef = { _id: 'mockChefId' };
    const existingDish = { _id: 'existingDishId' };

    // Mock the necessary functions
    Chef.findOne.mockResolvedValue(chef);
    Dish.findOne.mockResolvedValue(existingDish);

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.createDish(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dish already exists...' });
  });

  it('should return an error if the name is missing', async () => {
    // Mock the necessary data for the test
    const req = {
      cookies: { jwt: 'mockToken' },
      body: {
        description: 'Test Description',
        price: '10',
        rating: 4,
      },
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.createDish(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Name is required' });
  });

  it('should return an error if the description is missing', async () => {
    // Mock the necessary data for the test
    const req = createMockReqRes({
      name: 'Test Dish',
      price: '10',
      rating: 4,
    });

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.createDish(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Description is required' });
  });

  it('should return an error if the price is missing', async () => {
    // Mock the necessary data for the test
    const req = createMockReqRes({
      name: 'Test Dish',
      description: 'Test Description',
      rating: 4,
    });

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.createDish(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Price is required' });
  });
});

describe('getAllDishes', () => {
  it('should return all dishes related to the chef', async () => {
    // Mock the necessary data for the test
    const req = {
      cookies: { jwt: 'mockToken' },
    };

    const decodedToken = { userId: 'mockUserId' };
    const dishes = [
      { name: 'Dish 1', description: 'Description 1', price: '10' },
      { name: 'Dish 2', description: 'Description 2', price: '15' },
    ];

    // Mock the necessary functions
    decodeJwtToken.mockReturnValue(decodedToken);
    Dish.find.mockResolvedValue(dishes);

    // Mock the response object
    const res = {
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.getAllDishes(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({
      message: 'All dishes that related to the chef',
      data: dishes,
    });
  });

  it('should handle internal server error', async () => {
    // Mock the necessary data for the test
    const req = {
      cookies: { jwt: 'mockToken' },
    };

    // Mock the necessary functions to throw an error
    decodeJwtToken.mockImplementation(() => {
      throw new Error('Mocked error');
    });

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.getAllDishes(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('getDishById', () => {
  it('should return the specific dish using the dish Id', async () => {
    // Mock the necessary data for the test
    const req = {
      params: { id: 'mockDishId' },
    };

    const dish = {
      _id: 'mockDishId',
      name: 'Mock Dish',
      description: 'Mock Description',
      price: '10',
    };

    // Mock the necessary functions
    Dish.findById.mockResolvedValue(dish);

    // Mock the response object
    const res = {
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.getDishById(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({
      message: 'Get specific dish using the dish Id', // Fix the typo here
      data: dish,
    });
  });

  it('should return an error if the dish is not found', async () => {
    // Mock the necessary data for the test
    const req = {
      params: { id: 'nonExistentDishId' },
    };

    // Mock the necessary functions to return null (dish not found)
    Dish.findById.mockResolvedValue(null);

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.getDishById(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dish not found' });
  });
});

describe('deleteDishById', () => {
  it('should delete the dish successfully', async () => {
    // Mock the necessary data for the test
    const req = {
      params: { id: 'mockDishId' },
    };

    const dish = {
      _id: 'mockDishId',
      name: 'Mock Dish',
      description: 'Mock Description',
      price: '10',
    };

    // Mock the necessary functions
    Dish.findByIdAndDelete.mockResolvedValue(dish);

    // Mock the response object
    const res = {
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.deleteDishById(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dish deleted successfully',
    });
  });

  it('should return an error if the dish is not found', async () => {
    // Mock the necessary data for the test
    const req = {
      params: { id: 'nonExistentDishId' },
    };

    // Mock the necessary functions to return null (dish not found)
    Dish.findByIdAndDelete.mockResolvedValue(null);

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.deleteDishById(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dish not found' });
  });

  it('should handle server error', async () => {
    // Mock the necessary data for the test
    const req = {
      params: { id: 'mockDishId' },
    };

    // Mock the necessary functions to throw an error
    Dish.findByIdAndDelete.mockImplementation(() => {
      throw new Error('Mocked error');
    });

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await dishController.deleteDishById(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
  });
});
