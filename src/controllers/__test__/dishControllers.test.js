const dishController = require('../dishController');
const decodeJwtToken = require('../../helpers/decodeJwtToken');
const Chef = require('../../models/chef');
const Dish = require('../../models/dish');

jest.mock('../../helpers/decodeJwtToken');
jest.mock('../../models/chef');
jest.mock('../../models/dish');

const createMockReqRes = (reqBody = {}) => ({
  cookies: { jwt: 'mockToken' },
  body: reqBody,
});

describe('createDish', () => {
  it('should create a new dish successfully', async () => {
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

    decodeJwtToken.mockReturnValue(decodedToken);
    Chef.findOne.mockResolvedValue(chef);
    Dish.findOne.mockResolvedValue(dish);
    Dish.prototype.save.mockResolvedValue(savedDish);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.createDish(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedDish);
  });

  it('should return an error if the dish already exists', async () => {
    const req = createMockReqRes({
      name: 'Test Dish',
      description: 'Test Description',
      price: '10',
      rating: 4,
    });
    const chef = { _id: 'mockChefId' };
    const existingDish = { _id: 'existingDishId' };

    Chef.findOne.mockResolvedValue(chef);
    Dish.findOne.mockResolvedValue(existingDish);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.createDish(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dish already exists...' });
  });

  it('should return an error if the name is missing', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
      body: {
        description: 'Test Description',
        price: '10',
        rating: 4,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.createDish(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Name is required' });
  });

  it('should return an error if the description is missing', async () => {
    const req = createMockReqRes({
      name: 'Test Dish',
      price: '10',
      rating: 4,
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.createDish(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Description is required' });
  });

  it('should return an error if the price is missing', async () => {
    const req = createMockReqRes({
      name: 'Test Dish',
      description: 'Test Description',
      rating: 4,
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.createDish(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Price is required' });
  });
});

describe('getAllDishes', () => {
  it('should return all dishes related to the chef', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
    };

    const decodedToken = { userId: 'mockUserId' };
    const dishes = [
      { name: 'Dish 1', description: 'Description 1', price: '10' },
      { name: 'Dish 2', description: 'Description 2', price: '15' },
    ];

    decodeJwtToken.mockReturnValue(decodedToken);
    Dish.find.mockResolvedValue(dishes);

    const res = {
      json: jest.fn(),
    };

    await dishController.getAllDishes(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'All dishes that related to the chef',
      data: dishes,
    });
  });

  it('should handle internal server error', async () => {
    const req = {
      cookies: { jwt: 'mockToken' },
    };

    decodeJwtToken.mockImplementation(() => {
      throw new Error('Mocked error');
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.getAllDishes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('getDishById', () => {
  it('should return the specific dish using the dish Id', async () => {
    const req = {
      params: { id: 'mockDishId' },
    };

    const dish = {
      _id: 'mockDishId',
      name: 'Mock Dish',
      description: 'Mock Description',
      price: '10',
    };

    Dish.findById.mockResolvedValue(dish);

    const res = {
      json: jest.fn(),
    };

    await dishController.getDishById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Get specific dish using the dish Id',
      data: dish,
    });
  });

  it('should return an error if the dish is not found', async () => {
    const req = {
      params: { id: 'nonExistentDishId' },
    };

    Dish.findById.mockResolvedValue(null);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.getDishById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dish not found' });
  });
});

describe('deleteDishById', () => {
  it('should delete the dish successfully', async () => {
    const req = {
      params: { id: 'mockDishId' },
    };

    const dish = {
      _id: 'mockDishId',
      name: 'Mock Dish',
      description: 'Mock Description',
      price: '10',
    };

    Dish.findByIdAndDelete.mockResolvedValue(dish);

    const res = {
      json: jest.fn(),
    };

    await dishController.deleteDishById(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Dish deleted successfully',
    });
  });

  it('should return an error if the dish is not found', async () => {
    const req = {
      params: { id: 'nonExistentDishId' },
    };

    Dish.findByIdAndDelete.mockResolvedValue(null);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.deleteDishById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Dish not found' });
  });

  it('should handle server error', async () => {
    const req = {
      params: { id: 'mockDishId' },
    };

    Dish.findByIdAndDelete.mockImplementation(() => {
      throw new Error('Mocked error');
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await dishController.deleteDishById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
  });
});
