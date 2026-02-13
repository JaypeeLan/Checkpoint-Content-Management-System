const swaggerJsdoc = require('swagger-jsdoc');
const { env } = require('../config/env');

const bearerAuth = [{ bearerAuth: [] }];

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'EduCMS API',
      version: '1.0.0',
      description: 'Educational Content Management System API'
    },
    servers: [
      {
        url: env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:5000/api/v1',
        description: env.NODE_ENV === 'production' ? 'Production' : 'Local development'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Invalid credentials' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                refreshToken: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['admin', 'editor', 'author', 'subscriber'] }
                  }
                }
              }
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            post_id: { type: 'integer' },
            title: { type: 'string' },
            slug: { type: 'string' },
            content: { type: 'string' },
            author_id: { type: 'integer', nullable: true },
            category_id: { type: 'integer', nullable: true },
            status: { type: 'string', enum: ['draft', 'published', 'archived'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            comment_id: { type: 'integer' },
            post_id: { type: 'integer' },
            post_title: { type: 'string', nullable: true },
            user_id: { type: 'integer', nullable: true },
            parent_id: { type: 'integer', nullable: true },
            content: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'spam', 'trash'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            category_id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true }
          }
        },
        Tag: {
          type: 'object',
          properties: {
            tag_id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' }
          }
        },
        AnalyticsSummary: {
          type: 'object',
          properties: {
            totalRequests: { type: 'integer' },
            mediaUploadsRequested: { type: 'integer' },
            searchRequests: { type: 'integer' },
            generatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'Service is healthy'
            }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and receive JWT tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
            },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } }
          }
        }
      },
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register and receive JWT tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Registration successful',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
            },
            409: { description: 'Email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } }
          }
        }
      },
      '/posts': {
        get: {
          tags: ['Posts'],
          summary: 'List posts',
          responses: {
            200: {
              description: 'Posts returned'
            }
          }
        },
        post: {
          tags: ['Posts'],
          summary: 'Create post',
          security: bearerAuth,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'slug', 'content'],
                  properties: {
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    content: { type: 'string' },
                    category_id: { type: 'integer' },
                    status: { type: 'string', enum: ['draft', 'published', 'archived'] }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Created',
              content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Post' } } } } }
            }
          }
        }
      },
      '/posts/{id}': {
        get: {
          tags: ['Posts'],
          summary: 'Get post by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Post returned' }, 404: { description: 'Not found' } }
        },
        put: {
          tags: ['Posts'],
          summary: 'Update post',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    slug: { type: 'string' },
                    content: { type: 'string' },
                    category_id: { type: 'integer' },
                    status: { type: 'string', enum: ['draft', 'published', 'archived'] }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } }
        },
        delete: {
          tags: ['Posts'],
          summary: 'Delete post',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } }
        }
      },
      '/comments': {
        get: {
          tags: ['Comments'],
          summary: 'List comments',
          responses: { 200: { description: 'Comments returned' } }
        },
        post: {
          tags: ['Comments'],
          summary: 'Create comment',
          security: bearerAuth,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['post_id', 'content'],
                  properties: {
                    post_id: { type: 'integer' },
                    content: { type: 'string' },
                    parent_id: { type: 'integer' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Comment created', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Comment' } } } } } },
            404: { description: 'Post not found' }
          }
        }
      },
      '/comments/{id}/status': {
        patch: {
          tags: ['Comments'],
          summary: 'Update comment status',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['pending', 'approved', 'spam', 'trash'] }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Status updated' }, 404: { description: 'Comment not found' } }
        }
      },
      '/comments/{id}': {
        delete: {
          tags: ['Comments'],
          summary: 'Delete comment',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' }, 404: { description: 'Comment not found' } }
        }
      },
      '/media/signature': {
        post: {
          tags: ['Media'],
          summary: 'Generate Cloudinary upload signature',
          security: bearerAuth,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['filename'],
                  properties: {
                    filename: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Signature generated' },
            400: { description: 'Cloudinary not configured' }
          }
        }
      },
      '/search/posts': {
        get: {
          tags: ['Search'],
          summary: 'Search posts',
          security: bearerAuth,
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search text. Empty returns recent posts.' }],
          responses: { 200: { description: 'Search results returned' } }
        }
      },
      '/analytics/summary': {
        get: {
          tags: ['Analytics'],
          summary: 'Get analytics summary',
          security: bearerAuth,
          responses: {
            200: {
              description: 'Summary returned',
              content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/AnalyticsSummary' } } } } }
            }
          }
        }
      },
      '/categories': {
        get: {
          tags: ['Categories'],
          summary: 'List categories',
          responses: { 200: { description: 'Categories returned' } }
        },
        post: {
          tags: ['Categories'],
          summary: 'Create category',
          security: bearerAuth,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'slug'],
                  properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/categories/{id}': {
        put: {
          tags: ['Categories'],
          summary: 'Update category',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Updated' } }
        },
        delete: {
          tags: ['Categories'],
          summary: 'Delete category',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } }
        }
      },
      '/tags': {
        get: {
          tags: ['Tags'],
          summary: 'List tags',
          responses: { 200: { description: 'Tags returned' } }
        },
        post: {
          tags: ['Tags'],
          summary: 'Create tag',
          security: bearerAuth,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'slug'],
                  properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Created' } }
        }
      },
      '/tags/{id}': {
        put: {
          tags: ['Tags'],
          summary: 'Update tag',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Updated' } }
        },
        delete: {
          tags: ['Tags'],
          summary: 'Delete tag',
          security: bearerAuth,
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Deleted' } }
        }
      }
    },
    tags: [
      { name: 'System' },
      { name: 'Auth' },
      { name: 'Posts' },
      { name: 'Comments' },
      { name: 'Media' },
      { name: 'Search' },
      { name: 'Analytics' },
      { name: 'Categories' },
      { name: 'Tags' }
    ]
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };