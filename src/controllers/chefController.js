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

exports.getChefInfo = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);
  try {
    const chef = await Chef.findOne({ userId: decodedToken.userId });
    if (!chef) {
      throw new Error('Chef does not exist. You need to create your Chef.');
    }

    res.status(200).json({ chef });
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

exports.editChefInfo = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);

  try {
    const updatedChef = await Chef.findOneAndUpdate(
      { userId: decodedToken.userId },
      req.body,
      { new: true }
    );

    if (!updatedChef) {
      throw new Error('Chef does not exist');
    }

    res.status(201).json({ chef: updatedChef });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
