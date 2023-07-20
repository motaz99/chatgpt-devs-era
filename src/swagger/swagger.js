const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cookiz Project API with Swagger',
      version: '1.0.0',
      description:
        'This is the documentation for all the functionalities in Cookiz Website',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      schemas: {
        User: {
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
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['../routes/index.js'],
};

const spec = swaggerJsDoc(options);

module.exports = spec;
