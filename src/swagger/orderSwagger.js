const order = {
  post: {
    tags: ['Orders'],
    summary: 'Create a new order',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Order',
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
