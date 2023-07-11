const Dish = require('../models/dish');

exports.createDish = async (req, res) => {
  try {
    const { name, description, price, rating } = req.body;

    const newDish = new Dish({
      name,
      description,
      price,
      rating,
    });

    const savedDish = await newDish.save();

    res.status(201).json(savedDish);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();

    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
