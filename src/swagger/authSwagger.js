const signup = {
  post: {
    tags: ['Authentication'],
    summary: 'User Signup',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/User',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User created successfully',
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

const login = {
  post: {
    tags: ['Authentication'],
    summary: 'User Login',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LoginUser',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'User logged in successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginResponse',
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

const logout = {
  post: {
    tags: ['Authentication'],
    summary: 'User Logout',
    responses: {
      200: {
        description: 'Logged out successfully',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Logged out successfully',
                },
                email: {
                  type: 'string',
                  example: 'stefan.zweig@email.com',
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

const passwordReset = {
  post: {
    tags: ['Authentication'],
    summary: 'Password Reset',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/PasswordResetRequest',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset successful',
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

module.exports = { signup, login, logout, passwordReset };
