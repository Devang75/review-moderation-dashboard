import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Review Moderation API',
      version: '1.0.0',
      description: 'API for creating, viewing and moderating product reviews with automatic risk scoring',
    },
    servers: [
      {
        url: '/api',
        description: 'API',
      },
    ],
    components: {
      schemas: {
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'MongoDB ID' },
            productId: { type: 'string', example: 'sku-12' },
            author: { type: 'string', example: 'user@example.com' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            text: { type: 'string', example: 'Great product, highly recommend!' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            riskScore: { type: 'integer', minimum: 0, maximum: 100, example: 0 },
            flags: { type: 'array', items: { type: 'string' } },
            moderatorReason: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateReviewInput: {
          type: 'object',
          required: ['productId', 'author', 'rating', 'text'],
          properties: {
            productId: { type: 'string', example: 'sku-12' },
            author: { type: 'string', example: 'user@example.com' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            text: { type: 'string', example: 'Great product, highly recommend!' },
          },
        },
        UpdateReviewInput: {
          type: 'object',
          properties: {
            productId: { type: 'string', example: 'sku-12' },
            author: { type: 'string', example: 'user@example.com' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            text: { type: 'string', example: 'Updated review text' },
          },
        },
        RejectInput: {
          type: 'object',
          required: ['reason'],
          properties: {
            reason: { type: 'string', example: 'Violates community guidelines' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer' },
            data: { type: 'object' },
            message: { type: 'string' },
            success: { type: 'boolean' },
          },
        },
        PaginatedReviews: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
            total: { type: 'integer', example: 50 },
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation Error' },
            success: { type: 'boolean', example: false },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'rating' },
                  message: { type: 'string', example: 'Rating must be at least 1' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
