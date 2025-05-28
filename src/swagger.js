const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Order System API',
      version: '1.0.0',
      description: 'API documentation for the Restaurant Order System',
    },
    servers: [
      {
        url: 'https://restaurant-api-production-a8f9.up.railway.app',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 