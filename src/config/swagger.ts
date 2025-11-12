import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Storybook API',
      version: '1.0.0',
      description: 'API for personalized storybook generation'
    },
    servers: [
      {
        url: '/',
        description: 'Current Server (Auto-detected)'
      },
      {
        url: 'http://localhost:5000',
        description: 'Local Development'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);