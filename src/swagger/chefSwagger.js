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

module.exports = { createChef, chefInfo };
