const Client = require('../models/client');

exports.createClient = async (req, res) => {
  try {
    const { user, address, contactNumber } = req.body;

    const client = new Client({
      user,
      address,
      contactNumber,
    });

    const createdClient = await client.save();

    res.status(201).json(createdClient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ user: req.body.userID }); // .populate('user'); getting users info also

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({ user: req.body.userID });

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
    }

    if (client.address !== req.body.address) {
      client.address = req.body.address;
    }

    if (client.contactNumber !== req.body.contactNumber) {
      client.contactNumber = req.body.contactNumber;
    }

    if (client.favoriteDishes !== req.body.favoriteDishes) {
      client.favoriteDishes = req.body.favoriteDishes;
    }

    const updatedClient = await client.save();

    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
