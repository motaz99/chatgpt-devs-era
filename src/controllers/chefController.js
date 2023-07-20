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
    const checkChef = await Chef.findOne({ userId: decodedToken.userId });
    if (checkChef) {
      throw new Error('Chef already exists.');
    }
    await Chef.create({
      userId: decodedToken.userId,
      restaurant,
      location,
      openingHours,
      closingHours,
      contactNumber,
      description,
    });

    res.status(201).redirect('/api/chef/me');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChefInfo = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = decodeJwtToken(token);
  try {
    const chef = await Chef.findOne({ userId: decodedToken.userId });

    res.status(200).json({ message: 'Chef information page', data: chef });
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

    res
      .status(201)
      .json({ message: 'Chef object got updated', data: updatedChef });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
