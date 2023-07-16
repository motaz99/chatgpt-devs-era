const decodeJwtToken = require('../helpers/decodeJwtToken');

const Chef = require('../models/chef');

exports.createChef = async (req, res) => {
  const {
    restaurant,
    location,
    openingHours,
    closingHours,
    contactNumber,
    description,
  } = req.body;

  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);

  try {
    const checkChef = await Chef.findOne({ restaurant });
    if (checkChef) {
      throw new Error('Chef already exists.');
    }
    const newChef = new Chef({
      userId: decodedToken.userId,
      restaurant,
      location,
      openingHours,
      closingHours,
      contactNumber,
      description,
    });

    await newChef.save();

    res.status(201).json('Chef created successfully');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the Chef info
exports.getChefInfo = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);

  try {
    const chef = await Chef.findOne({ userId: decodedToken });
    if (!chef) {
      throw new Error('Chef does not exist. You need to create your Chef.');
    }

    res.status(200).json({ chef });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Edit the chef's info
exports.editChefInfo = async (req, res) => {
  // we need to get chef's id value here
  const id = '64affcdef920783b12423498';

  const {
    restaurant,
    location,
    openingHours,
    closingHours,
    contactNumber,
    description,
  } = req.body;

  try {
    const checkChef = await Chef.findOne({ chef: id });
    if (!checkChef) {
      throw new Error('Chef does not exist');
    }

    checkChef.restaurant = restaurant;
    checkChef.location = location;
    checkChef.openingHours = openingHours;
    checkChef.closingHours = closingHours;
    checkChef.contactNumber = contactNumber;
    checkChef.description = description;

    const savedChef = await checkChef.save();

    res.status(201).json({ savedChef });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
