const Chef = require('../models/chef');

exports.createRestaurant = async (req, res) => {
  const {
    restaurant,
    location,
    openingHours,
    closingHours,
    contactNumber,
    description,
  } = req.body;

  try {
    if (
      !restaurant &&
      !location &&
      !openingHours &&
      !closingHours &&
      !contactNumber &&
      !description
    ) {
      throw new Error('Incomplete information...');
    }

    const checkRestaurant = await Chef.findOne({ restaurant });
    if (checkRestaurant) {
      throw new Error('Restaurant already exists.');
    }

    const newRestaurant = new Chef({
      userId: req.session.userId,
      restaurant,
      location,
      openingHours,
      closingHours,
      contactNumber,
      description,
    });

    await newRestaurant.save();

    res.status(201).json('Restaurant created successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the restaurant info
exports.getRestaurantInfo = async (req, res) => {
  const id = req.session.userId;

  try {
    const restaurant = await Chef.findOne({ userId: id });
    if (!restaurant) {
      throw new Error(
        'Restaurant does not exist. You need to create your restaurant.'
      );
    }

    res.status(200).json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Edit the restaurant info
exports.editRestaurant = async (req, res) => {
  const id = req.session.userId;
  const {
    restaurant,
    location,
    openingHours,
    closingHours,
    contactNumber,
    description,
  } = req.body;

  try {
    if (
      !restaurant &&
      !location &&
      !openingHours &&
      !closingHours &&
      !contactNumber &&
      !description
    ) {
      throw new Error('Incomplete information...');
    }

    const checkRestaurant = await Chef.findOne({ userId: id });
    if (!checkRestaurant) {
      throw new Error('Restaurant does not exist');
    }

    checkRestaurant.restaurant = restaurant;
    checkRestaurant.location = location;
    checkRestaurant.openingHours = openingHours;
    checkRestaurant.closingHours = closingHours;
    checkRestaurant.contactNumber = contactNumber;
    checkRestaurant.description = description;

    const savedRestaurant = await checkRestaurant.save();

    res.status(201).json({ savedRestaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
