const postOrder = {
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
                    quantity: {
                      type: 'integer',
                      example: 2,
                    },
                  },
                  required: ['dishId', 'quantity'],
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

const getChefOrders = {
  get: {
    tags: ['Orders'],
    summary: 'Get orders for the chef',
    responses: {
      200: {
        description: 'Successful response with orders',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Order' },
            },
          },
        },
      },
      500: {
        description: 'Internal server error',
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

const chefUpdateStatus = {
  put: {
    tags: ['Orders'],
    summary: 'Update order status for the authenticated chef',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              newStatus: {
                type: 'string',
                example: 'delivered',
              },
              orderId: {
                type: 'string',
                example: '64adddb8ffed160fd72dc69c',
              },
            },
          },
          required: ['newStatus', 'orderId'],
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response with updated order status',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/Order' },
        },
      },
    },
    500: {
      description: 'Internal server error',
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
};

const clientCancelOrder = {
  put: {
    tags: ['Orders'],
    summary: 'Cancel an order by the client',
    parameters: [
      { name: 'orderId', in: 'path', required: true, type: 'string' },
      {
        name: 'body',
        in: 'body',
        required: true,
      },
    ],
    responses: {
      200: {
        description: 'Successful response after order cancellation',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
      500: {
        description: 'Internal server error',
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

module.exports = {
  postOrder,
  getChefOrders,
  chefUpdateStatus,
  clientCancelOrder,
};
