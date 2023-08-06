const decodeJwtToken = require('../helpers/decodeJwtToken');
const Chef = require('../models/chef');
const Dish = require('../models/dish');

exports.createDish = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);
  const { name, description, price, rating } = req.body;

  if (!name) {
    res.status(500).json({ error: 'Name is required' });
  }

  if (!description) {
    res.status(500).json({ error: 'Description is required' });
  }

  if (!price) {
    res.status(500).json({ error: 'Price is required' });
  }

  try {
    const chef = await Chef.findOne({ userId: decodedToken.userId });
    const checkDish = await Dish.findOne({ name, chefId: chef._id });
    if (checkDish) {
      throw new Error('Dish already exists...');
    }

    const newDish = new Dish({
      chefId: chef._id,
      userId: decodedToken.userId,
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
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const dishes = await Dish.find({ userId: decodedToken.userId });

    res.json({ message: 'All dishes that related to the chef', data: dishes });
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

    res.json({ message: 'Get specific dish using the dish Id', data: dish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDishById = async (req, res) => {
  const dishId = req.params.id;

  try {
    const dish = await Dish.findByIdAndDelete(dishId);

    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
    }

    res.json({ message: 'Dish deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
