import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API para encurtamento de URLs com sistema de autenticação',
      contact: {
        name: 'Matheus Willian',
        email: 'matheusmws31@gmail.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
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
        RegisterUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              description: 'Senha do usuário (mínimo 6 caracteres)'
            }
          }
        },
        LoginUserDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              description: 'Senha do usuário (mínimo 6 caracteres)'
            }
          }
        },
        CreateUrlDto: {
          type: 'object',
          required: ['originalUrl'],
          properties: {
            originalUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL original para encurtar'
            }
          }
        },
        UrlResponseDto: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            originalUrl: {
              type: 'string',
              format: 'uri'
            },
            shortCode: {
              type: 'string'
            },
            shortUrl: {
              type: 'string',
              format: 'uri'
            },
            clicks: {
              type: 'integer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de erros de validação'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts']
};

export default swaggerJsdoc(options); 