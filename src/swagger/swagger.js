const swaggerJsDoc = require('swagger-jsdoc');
const schema = require('./schemasSwagger');
const authSwagger = require('./authSwagger');
const chefSwagger = require('./chefSwagger');
const clientSwagger = require('./clientSwagger');
const orderSwagger = require('./orderSwagger');

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
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://cookiz-app-fxjrs.ondigitalocean.app/api'
            : 'http://localhost:3000/api',
      },
    ],
    components: {
      schemas: {
        User: schema.user,
        Chef: schema.chef,
        Client: schema.client,
        Dish: schema.dish,
        Order: schema.order,
        LoginUser: schema.loginUser,
        LoginResponse: schema.loginResponse,
        UpdateClient: schema.updateClient,
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
      '/chef/me': {
        get: chefSwagger.chefInfo.get,
        put: chefSwagger.chefInfo.put,
      },
      '/chef/dish/': chefSwagger.dish,
      '/chef/dish/{id}': chefSwagger.dishById,
      '/clients/': clientSwagger.createClient,
      '/clients/me': {
        get: clientSwagger.getUpdateClient.get,
        put: clientSwagger.getUpdateClient.put,
      },
      '/clients/me/favorite-dishes': {
        post: clientSwagger.favoriteDish.post,
        get: clientSwagger.favoriteDish.get,
      },
      '/clients/me/favorite-dishes/{id}': clientSwagger.deleteFavDish,
      '/clients/me/order-history': clientSwagger.orderHistory,
      '/clients/chefs': clientSwagger.getChefs,
      '/clients/chefs/{id}': clientSwagger.chefById,
      '/orders/': orderSwagger,
    },
  },
  apis: ['../routes/index.js'],
};

const spec = swaggerJsDoc(options);

module.exports = spec;
