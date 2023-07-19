const decodeJwtToken = require('../helpers/decodeJwtToken');
const Chef = require('../models/chef');
const Dish = require('../models/dish');

exports.createDish = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);
  const { name, description, price } = req.body;
  try {
    const checkDish = await Dish.findOne({ name });
    if (checkDish) {
      throw new Error('Dish already exists...');
    }

    const chef = await Chef.findOne({ userId: decodedToken.userId });

    const newDish = new Dish({
      chefId: chef._id,
      userId: decodedToken.userId,
      name,
      description,
      price,
      /* picture, */
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
