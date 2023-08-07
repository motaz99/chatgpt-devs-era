const Dish = require('../models/dish');

exports.searchDish = async (req, res) => {
  const { value } = req.body;

  if (!value) {
    throw new Error('Please write a dish name to search for');
  }

  try {
    const dishes = await Dish.find({
      name: { $regex: new RegExp(value, 'i') },
    });

    if (dishes.length === 0) {
      res.json('There is no such a dish name');
    } else {
      res.json(dishes);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching for dishes' });
  }
};
