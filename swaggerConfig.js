//swaggerConfig.js

import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Todo REST API',
      version: '1.0.0',
      description: 'A simple REST API for managing user tasks, including authentication and profile image uploads.',
      contact: {
        name: 'API Support',
        // url: 'http://www.example.com/support', // Optional
        // email: 'support@example.com', // Optional
      },
      license: { // Optional
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [ // Add server information
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`, // Adjust if your base path differs
        description: 'Development server',
      },
      // Add other servers like staging or production if needed
    ],
    components: { // Define reusable components like security schemes
      securitySchemes: {
        bearerAuth: { // Name of the security scheme
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Format of the token
          description: 'Enter JWT Bearer token **_only_**'
        }
      },
      schemas: { // Define reusable schemas for request/response bodies
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'User ID' },
            firstName: { type: 'string', description: 'User\'s first name' },
            lastName: { type: 'string', description: 'User\'s last name' },
            email: { type: 'string', format: 'email', description: 'User\'s email address' },
            profileImageUrl: { type: 'string', format: 'url', nullable: true, description: 'URL of the user\'s profile image' },
            createdAt: { type: 'string', format: 'date-time', description: 'Timestamp of user creation' },
          },
          required: ['id', 'firstName', 'lastName', 'email', 'createdAt']
        },
        Service_provider: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'Task ID' },
            user_id: { type: 'string', format: 'uuid', description: 'ID of the user who owns the task' },
            title: { type: 'string', description: 'Task title' },
            description: { type: 'string', nullable: true, description: 'Provider description' },
            created_at: { type: 'string', format: 'date-time', description: 'Timestamp of service creation' },
            updated_at: { type: 'string', format: 'date-time', description: 'Timestamp of last service updated' },
          },
          required: ['id', 'user_id', 'title', 'completed', 'created_at', 'updated_at']
        },
        Appointment: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Task ID' },
              user_id: { type: 'string', format: 'uuid', description: 'ID of the user who owns the task' },
              title: { type: 'string', description: 'Task title' },
              description: { type: 'string', nullable: true, description: 'Provider description' },
              created_at: { type: 'string', format: 'date-time', description: 'Timestamp of appointment creation' },
              updated_at: { type: 'string', format: 'date-time', description: 'Timestamp of last appointment updated' },
            },
            required: ['id', 'user_id', 'title', 'description', 'created_at', 'updated_at']
          },
          Time_slots: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid', description: 'Task ID' },
              user_id: { type: 'string', format: 'uuid', description: 'ID of the user who owns the task' },
              start_time: { type: 'string', format: 'date-time', description: 'Timestamp of user start' },
              end_time: { type: 'string', format: 'date-time', description: 'Timestamp of last user end' },
            },
            required: ['id', 'user_id', 'title', 'description', 'created_at', 'updated_at']
          },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
          }
        }
      }
    },
    security: [ // Apply security globally (can be overridden per operation)
      {
        bearerAuth: [] // Requires bearerAuth for all routes unless specified otherwise
      }
    ]
  },
  // Path to the API docs files that contain OpenAPI annotations
  apis: ['./routes/*.js'], };

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec; 
