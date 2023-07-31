const order = {
  post: {
    tags: ['Orders'],
    summary: 'Create a new order',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
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
                      type: 'integer',
                      example: 2,
                    },
                  },
                  required: ['dishId', 'chefId', 'quantity'],
                },
              },
              status: {
                type: 'string',
                enum: ['pending', 'completed'],
                example: 'pending',
              },
            },
            required: ['items', 'status'],
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Order created successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Order',
            },
          },
        },
      },
      500: {
        description: 'Failed to create the order',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = order;
