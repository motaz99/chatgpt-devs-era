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
          required: ['firstname', 'lastname', 'email', 'role'],
        },
        Chef: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              example: '64adddb8ffed160fd72dc69c',
            },
            restaurant: {
              type: 'string',
              example: 'Pizza House',
            },
            location: {
              type: 'string',
              example: '111 Cross Street',
            },
            openingHours: {
              type: 'string',
              example: '9:00 AM',
            },
            closingHours: {
              type: 'string',
              example: '6:00 PM',
            },
            contactNumber: {
              type: 'string',
              example: '+908887776655',
            },
            description: {
              type: 'string',
              example: 'Best pizza in the city',
            },
          },
          required: [
            'userId',
            'restaurant',
            'location',
            'openingHours',
            'closingHours',
            'contactNumber',
            'description',
          ],
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
