// controllers/dishController.js
const Dish = require('../models/dish');

// Create a new dish
exports.createDish = async (req, res) => {
  // we need to get an id as an authorized user
  // const id = req.
  const { name, description, price, rating } = req.body;
  try {
    const checkDish = await Dish.findOne({ name });
    if (checkDish) {
      throw new Error('Dish already exists...');
    }

    // Create a new dish object
    const newDish = new Dish({
      // chef: id,
      name,
      description,
      price,
      /* picture, */
      rating,
    });

    // Save the dish to the database
    const savedDish = await newDish.save();

    // Send the saved dish as a response
    res.status(201).json({ savedDish });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    // Retrieve all dishes from the database
    const dishes = await Dish.find();

    // Send the array of dishes as a response
    res.json({ dishes });
  } catch (error) {
    // Handle server error
    res.status(500).json({ error: 'Internal server error' });
  }
};
