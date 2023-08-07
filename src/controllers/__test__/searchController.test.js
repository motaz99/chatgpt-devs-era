const Dish = require('../../models/dish');
const searchDish = require('../searchController');

describe('searchDish', () => {
  it('should return dishes matching the search', async () => {
    const req = {
      body: {
        value: 'Pizza',
      },
    };
    const res = {
      json: jest.fn(),
    };

    Dish.find = jest
      .fn()
      .mockResolvedValue([
        { name: 'Pizza Margherita' },
        { name: 'Pepperoni Pizza' },
      ]);

    await searchDish.searchDish(req, res);

    expect(Dish.find).toHaveBeenCalledTimes(1);
    expect(Dish.find).toHaveBeenCalledWith({
      name: { $regex: /Pizza/i },
    });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([
      { name: 'Pizza Margherita' },
      { name: 'Pepperoni Pizza' },
    ]);
  });

  it('should return a message for no matching dishes', async () => {
    const req = {
      body: {
        value: 'Sushi',
      },
    };
    const res = {
      json: jest.fn(),
    };

    Dish.find = jest.fn().mockResolvedValue([]);

    await searchDish.searchDish(req, res);

    expect(Dish.find).toHaveBeenCalledTimes(1);
    expect(Dish.find).toHaveBeenCalledWith({
      name: { $regex: /Sushi/i },
    });
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith('There is no such a dish name');
  });

  //   it('should handle missing search value', async () => {
  //     const req = {
  //       body: {
  //         value: '',
  //       },
  //     };
  //     const res = {
  //       status: jest.fn().mockReturnThis(),
  //       json: jest.fn(),
  //     };

  //     await searchDish.searchDish(req, res);

  //     expect(res.status).toHaveBeenCalledTimes(1);
  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledTimes(1);
  //     expect(res.json).toHaveBeenCalledWith({
  //       error: 'Please write a dish name to search for',
  //     });
  //   });

  it('should handle server error', async () => {
    const req = {
      body: {
        value: 'Burger',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Dish.find = jest.fn().mockRejectedValue(new Error('Database error'));

    await searchDish.searchDish(req, res);

    expect(Dish.find).toHaveBeenCalledTimes(1);
    expect(Dish.find).toHaveBeenCalledWith({
      name: { $regex: /Burger/i },
    });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while searching for dishes',
    });
  });
});
