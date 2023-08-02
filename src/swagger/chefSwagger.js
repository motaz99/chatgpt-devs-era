const createChef = {
  post: {
    tags: ['Chef'],
    summary: 'Create Chef',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Chef',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Chef created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Chef',
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
};

const chefInfo = {
  get: {
    tags: ['Chef'],
    summary: 'Get Chef Info',
    responses: {
      200: {
        description: 'Chef information page',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                data: {
                  $ref: '#/components/schemas/Chef',
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
  put: {
    tags: ['Chef'],
    summary: 'Edit Chef Info',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Chef',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Chef object got updated',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                data: {
                  $ref: '#/components/schemas/Chef',
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

const dish = {
  post: {
    tags: ['Chef'],
    summary: 'Create Dish',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Dish',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Dish created successfully',
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
    tags: ['Chef'],
    summary: 'Get All Dishes',
    responses: {
      200: {
        description: 'List of all dishes',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Dish',
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

const dishById = {
  get: {
    tags: ['Chef'],
    summary: 'Get Dish by ID',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'Dish found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Dish',
            },
          },
        },
      },
      404: {
        description: 'Dish not found',
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

module.exports = { createChef, chefInfo, dish, dishById };
