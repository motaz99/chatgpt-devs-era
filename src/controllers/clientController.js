const Client = require('../models/client');
const Dish = require('../models/dish');
const Chef = require('../models/chef');
const decodeJwtToken = require('../helpers/decodeJwtToken');

exports.createClient = async (req, res) => {
  try {
    const { address, contactNumber } = req.body;
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);
    const existingClient = await Client.findOne({
      userId: decodedToken.userId,
    });

    if (existingClient) {
      throw new Error('Client already exists');
    }

    await Client.create({
      userId: decodedToken.userId,
      address,
      contactNumber,
    });

    res.status(201).redirect('/api/clients/chefs');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);
    const client = await Client.findOne({ userId: decodedToken.userId });

    res.status(200).json({ message: 'Client information page', data: client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);

    const updatedClient = await Client.findOneAndUpdate(
      { userId: decodedToken.userId },
      req.body,
      { new: true }
    );

    res
      .status(200)
      .json({ message: 'Client object got updated', data: updatedClient });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createFavoriteDish = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);
    const client = await Client.findOne({ userId: decodedToken.userId });

    if (!client) {
      throw new Error('Client not found');
    }

    const { dishId } = req.body;
    const dish = await Dish.findById(dishId);

    if (!dish) {
      throw new Error('Dish not found');
    }

    const favoriteDish = {
      dishId: dish.id,
      name: dish.name,
    };

    client.favoriteDishes.push(favoriteDish);
    await client.save();

    res.status(200).json({ message: 'Favorite dish is added', data: client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFavoriteDishes = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);
    const client = await Client.findOne({ userId: decodedToken.userId });

    const { favoriteDishes } = client;
    res
      .status(200)
      .json({ message: 'Favorite Dishes array', data: favoriteDishes });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteFavoriteDish = async (req, res) => {
  // Delete a favorite dish now is broken but for now it uses the userId from the jwt token
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);
    const client = await Client.findOne({ userId: decodedToken.userId });

    if (!client) {
      throw new Error('Client not found');
    }

    const dishId = req.params.id;
    client.favoriteDishes.pull(dishId);
    await client.save();

    res.status(200).json({ message: 'Favorite dish is deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = decodeJwtToken(token);
    const client = await Client.findOne({
      userId: decodedToken.userId,
    }).populate('orderHistory');

    if (!client) {
      throw new Error('Client not found');
    }

    const { orderHistory } = client;
    res.status(200).json({ orderHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();

    if (chefs.length === 0) {
      res.json({ message: 'No chefs available yet' });
    }

    res.status(200).json({ message: 'Array of available chefs', data: chefs });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error while retrieving chefs: ${error.message}` });
  }
};

exports.getChefById = async (req, res) => {
  try {
    const chefId = req.params.id;
    const chef = await Chef.findById(chefId);

    if (!chef) {
      throw new Error('Chef not found');
    }

    res.status(200).json(chef);
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
    const averageRating = ratingSum / ratingsCount;

    dish.ratingAve = averageRating.toFixed(1);

    await dish.save();

    res.status(201).json('Dish Rated Successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChefDishes = async (req, res) => {
  const userId = req.params.id;

  try {
    const chefDishes = await Dish.find({ userId });

    if (chefDishes.length === 0) {
      res.status(200).json({
        message: 'Dishes that are related to this chef',
        data: "This chef didn't add dishes yet",
      });
    }

    res.status(200).json({
      message: 'Dishes that are related to this chef',
      data: chefDishes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchDish = async (req, res) => {
  const { value } = req.body;

  if (!value) {
    throw new Error('Please write a dish name to search for.');
  }

  try {
    const dishes = await Dish.find({
      name: { $regex: new RegExp(value, 'i') },
    });

    if (dishes.length === 0) {
      res.json('There is no such a dish name...');
    } else {
      res.json(dishes);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching for dishes.' });
  }
};
