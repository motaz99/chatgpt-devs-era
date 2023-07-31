const createClient = {
  post: {
    tags: ['Client'],
    summary: 'Create a new client',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Client',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Client created successfully',
      },
      400: {
        description: 'Bad Request',
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

const getUpdateClient = {
  get: {
    tags: ['Client'],
    summary: 'Get client information',
    responses: {
      200: {
        description: 'Client information retrieved successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Client',
            },
          },
        },
      },
      500: {
        description: 'Server Error',
      },
    },
  },
  put: {
    tags: ['Client'],
    summary: 'Update client information',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateClient',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Client information updated successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Client',
            },
          },
        },
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

const favoriteDish = {
  post: {
    tags: ['Client'],
    summary: 'Add a favorite dish for the client',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              dishId: {
                type: 'string',
                description: 'The ID of the dish to add to favorites',
              },
            },
            required: ['dishId'],
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Favorite dish added successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Client',
            },
          },
        },
      },
      400: {
        description: 'Bad Request',
      },
      500: {
        description: 'Server Error',
      },
    },
  },
  get: {
    tags: ['Client'],
    summary: 'Get client favorite dishes',
    responses: {
      200: {
        description: 'Client favorite dishes retrieved successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Client',
            },
          },
        },
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

const deleteFavDish = {
  delete: {
    tags: ['Client'],
    summary: 'Delete a favorite dish from the client',
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
          format: 'ObjectId',
        },
      },
    ],
    responses: {
      200: {
        description: 'Favorite dish deleted successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Client',
            },
          },
        },
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

const orderHistory = {
  get: {
    tags: ['Client'],
    summary: 'Get client order history',
    responses: {
      200: {
        description: 'Client order history retrieved successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Client',
            },
          },
        },
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

const getChefs = {
  get: {
    tags: ['Client'],
    summary: 'Get chefs',
    responses: {
      200: {
        description: 'Chefs retrieved successfully',
        conten: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'A success message',
                },
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Chef',
                  },
                  description: 'An array of available chefs',
                },
              },
            },
          },
        },
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

const chefById = {
  get: {
    tags: ['Client'],
    summary: 'Get chef by ID',
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Chef information retrieved successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Chef',
            },
          },
        },
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

module.exports = {
  createClient,
  getUpdateClient,
  favoriteDish,
  deleteFavDish,
  orderHistory,
  getChefs,
  chefById,
};
