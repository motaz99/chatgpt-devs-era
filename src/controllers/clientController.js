const Client = require('../models/client');
const Dish = require('../models/dish');

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
    const clientId = req.body.id;
    const client = await Client.findById(clientId);

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
    const clientId = req.body.id;
    const client = await Client.findById(clientId);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
    }

    client.address = req.body.address || client.address;
    client.contactNumber = req.body.contactNumber || client.contactNumber;

    if (req.body.favoriteDishes && Array.isArray(req.body.favoriteDishes)) {
      client.favoriteDishes = req.body.favoriteDishes;
    }

    const updatedClient = await client.save();

    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createFavoriteDish = async (req, res) => {
  try {
    const clientId = req.body.id;
    const client = await Client.findById(clientId);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
    }

    const { dishId } = req.body;
    const dish = await Dish.findById(dishId);

    if (!dish) {
      res.status(404).json({ error: 'Dish not found' });
    }

    const favoriteDish = {
      id: dish.id,
      name: dish.name,
    };

    client.favoriteDishes.push(favoriteDish);
    await client.save();

    res.status(200).json({ message: 'Favorite dish is added', client });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getFavoriteDishes = async (req, res) => {
  try {
    const clientId = req.body.id;
    const client = await Client.findById(clientId);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
    }

    const { favoriteDishes } = client;
    res.status(200).json({ favoriteDishes });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteFavoriteDish = async (req, res) => {
  try {
    const clientId = req.body.id;
    const client = await Client.findById(clientId);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
    }

    const dishId = req.params.id;
    client.favoriteDishes.pull(dishId);
    await client.save();

    res.status(200).json({ message: 'Favorite dish is deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
