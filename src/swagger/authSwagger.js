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
            $ref: '#/components/schemas/User',
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User logged in successfully',
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
      },
      500: {
        description: 'Server Error',
      },
    },
  },
};

module.exports = { signup, login, logout };
