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
        url: 'https://ai.thesynergyworks.com',
        description: 'Production'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);