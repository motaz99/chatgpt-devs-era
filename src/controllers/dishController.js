const decodeJwtToken = require('../helpers/decodeJwtToken');
const Chef = require('../models/chef');
const Dish = require('../models/dish');

exports.createDish = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);
  const { name, description, price } = req.body;
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
    res.json({ message: 'Get specif dish using the dish Id', data: dish });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.dishesRatings = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);

  const { id } = req.params;
  const { rating } = req.body;

  try {
    const dish = await Dish.findById(id);

    const existingRatingIndex = dish.ratings.findIndex((r) =>
      r.userId.equals(decodedToken.userId)
    );

    if (existingRatingIndex !== -1) {
      dish.ratings[existingRatingIndex].rating = rating;
    } else {
      const newRating = { userId: decodedToken.userId, rating };
      dish.ratings.push(newRating);
    }

    const ratingsCount = dish.ratings.length;
    const ratingSum = dish.ratings.reduce(
      (sum, value) => sum + value.rating,
      0
    );
    const averageRating = ratingsCount > 0 ? ratingSum / ratingsCount : 0;

    dish.ratingAve = averageRating.toFixed(1);

    await dish.save();

    res.status(201).json('Dish Rated Successfully');
  } catch (error) {
    res.status(500).json(error.message);
  }
};
