const swaggerJsDoc = require('swagger-jsdoc');
const schema = require('./schemasSwagger');
const authSwagger = require('./authSwagger');
const chefSwagger = require('./chefSwagger');
const clientSwagger = require('./clientSwagger');

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
        User: schema.user,
        Chef: schema.chef,
        Client: schema.client,
        Dish: schema.dish,
        Order: schema.order,
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/auth/signup': authSwagger.signup,
      '/auth/login': authSwagger.login,
      '/auth/logout': authSwagger.logout,
      '/auth/passwordReset': authSwagger.passwordReset,
      '/chef/': chefSwagger.createChef,
      '/chef/me': chefSwagger.chefInfo,
      '/chef/dish/': chefSwagger.dish,
      '/chef/dish/{id}': chefSwagger.dishById,
      '/client/': clientSwagger.createClient,
      '/client/me': clientSwagger.getUpdateClient,
      '/client/me/favorite-dishes': clientSwagger.favoriteDish,
      '/client/me/favorite-dishes/:id': clientSwagger.deleteFavDish,
    },
  },
  apis: ['../routes/index.js'],
};

const spec = swaggerJsDoc(options);

module.exports = spec;
