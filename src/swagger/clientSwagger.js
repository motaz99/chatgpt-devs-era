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
            $ref: '#/components/schemas/Client',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Client information updated successfully',
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
                example: '64adddb8ffed160fd72dc69c',
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
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

module.exports = { createClient, getUpdateClient, favoriteDish };
