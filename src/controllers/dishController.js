const Dish = require('../models/dish');

exports.createDish = async (req, res) => {
  // we need to get an id as an authorized user
  // const id = req.
  const { name, description, price, rating } = req.body;
  try {
    const checkDish = await Dish.findOne({ name });
    if (checkDish) {
      throw new Error('Dish already exists...');
    }

    const newDish = new Dish({
      // chef: id,
      name,
      description,
      price,
      /* picture, */
      rating,
    });

    const savedDish = await newDish.save();

    res.status(201).json(savedDish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();

    res.json({ dishes });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDishById = async (req, res) => {
  const dishId = req.params.id;

  try {
    const dish = await Dish.findById(dishId);

    if (!dish) {
      throw new Error('Dish not found');
    }

    res.json(dish);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
