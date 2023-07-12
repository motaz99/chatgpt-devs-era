// controllers/dishController.js
const Dish = require('../models/dish');

// Create a new dish
exports.createDish = async (req, res) => {
  try {
    const { name, description, price, rating } = req.body;

    // Create a new dish object
    const newDish = new Dish({
      name,
      description,
      price,
      rating,
    });

    // Save the dish to the database
    const savedDish = await newDish.save();

    // Send the saved dish as a response
    res.status(201).json(savedDish);
  } catch (error) {
    // Handle server error
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    // Retrieve all dishes from the database
    const dishes = await Dish.find();

    // Send the array of dishes as a response
    res.json(dishes);
  } catch (error) {
    // Handle server error
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDishById = async (req, res) => {
  const dishId = req.body.id;

  try {
    const dish = await Dish.findById(dishId);

    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
    }

    res.json(dish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
