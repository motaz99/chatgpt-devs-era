const Chef = require('../models/chef');

exports.createRestaurant = async (req, res) => {
  const {
    Restaurant,
    Location,
    OpeningHours,
    ClosingHours,
    ContactNumber,
    Description,
  } = req.body;

  try {
    if (
      !Restaurant &&
      !Location &&
      !OpeningHours &&
      !ClosingHours &&
      !ContactNumber &&
      !Description
    ) {
      throw new Error('Incomplete information...');
    }

    const checkRestaurant = await Chef.findOne({ Restaurant });
    if (checkRestaurant) {
      throw new Error('Restaurant already exists.');
    }

    const newRestaurant = new Chef({
      userId: req.session.userId,
      Restaurant,
      Location,
      OpeningHours,
      ClosingHours,
      ContactNumber,
      Description,
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
    Restaurant,
    Location,
    OpeningHours,
    ClosingHours,
    ContactNumber,
    Description,
  } = req.body;

  try {
    if (
      !Restaurant &&
      !Location &&
      !OpeningHours &&
      !ClosingHours &&
      !ContactNumber &&
      !Description
    ) {
      throw new Error('Incomplete information...');
    }

    const checkRestaurant = await Chef.findOne({ userId: id });
    if (!checkRestaurant) {
      throw new Error('Restaurant does not exist');
    }

    checkRestaurant.Restaurant = Restaurant;
    checkRestaurant.Location = Location;
    checkRestaurant.OpeningHours = OpeningHours;
    checkRestaurant.ClosingHours = ClosingHours;
    checkRestaurant.ContactNumber = ContactNumber;
    checkRestaurant.Description = Description;

    const savedRestaurant = await checkRestaurant.save();

    res.status(201).json({ savedRestaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
