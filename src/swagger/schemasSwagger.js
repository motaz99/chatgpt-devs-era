const user = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string',
      example: 'Stefan',
    },
    lastname: {
      type: 'string',
      example: 'Zweig',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'stefan.zweig@email.com',
    },
    password: {
      type: 'string',
      example: 'Password1',
    },
    type: {
      type: 'string',
      default: 'normal-user',
    },
    role: {
      type: 'string',
      enum: ['client', 'chef'],
      example: 'client',
    },
  },
  required: ['firstname', 'lastname', 'email', 'password', 'role'],
};

const chef = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      example: '64adddb8ffed160fd72dc69c',
    },
    restaurant: {
      type: 'string',
      example: 'Pizza House',
    },
    location: {
      type: 'string',
      example: '111 Cross Street',
    },
    openingHours: {
      type: 'string',
      example: '9:00 AM',
    },
    closingHours: {
      type: 'string',
      example: '6:00 PM',
    },
    contactNumber: {
      type: 'string',
      example: '+908887776655',
    },
    description: {
      type: 'string',
      example: 'Best pizza in the city',
    },
  },
  required: [
    'userId',
    'restaurant',
    'location',
    'openingHours',
    'closingHours',
    'contactNumber',
    'description',
  ],
};

const client = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      example: '64adddb8ffed160fd72dc69c',
    },
    address: {
      type: 'string',
      example: '112 Cross Street',
    },
    contactNumber: {
      type: 'string',
      example: '+908887776655',
    },
    favoriteDishes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dishId: {
            type: 'string',
            example: '64adddb8ffed160fd72dc69c',
          },
          name: {
            type: 'string',
            example: 'Pizza',
          },
        },
      },
    },
  },
  required: ['userId', 'address', 'contactNumber'],
};

const dish = {
  type: 'object',
  properties: {
    chefId: {
      type: 'string',
      example: '64adddb8ffed160fd72dc69c',
    },
    userId: {
      type: 'string',
      example: '64adddb8ffed160fd72dc69c',
    },
    name: {
      type: 'string',
      example: 'Mediterranean Pizza',
    },
    description: {
      type: 'string',
      example: 'Pizza with mediterranean veggies as topping',
    },
    price: {
      type: 'string',
      example: '$12.99',
    },
    rating: {
      type: 'string',
      example: '4.5',
    },
  },
  required: ['chefId', 'userId', 'name', 'description', 'price'],
};

const order = {
  type: 'object',
  properties: {
    clientId: {
      type: 'string',
      example: '64adddb8ffed160fd72dc69c',
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dishId: {
            type: 'string',
            example: '64adddb8ffed160fd72dc69c',
          },
          chefId: {
            type: 'string',
            example: '64adddb8ffed160fd72dc69c',
          },
          quantity: {
            type: 'number',
            example: 2,
          },
        },
      },
    },
    status: {
      type: 'string',
      enum: ['pending', 'inProgress', 'cancel', 'onTheWay', 'delivered'],
      example: 'pending',
    },
  },
};

module.exports = { user, chef, client, dish, order };
