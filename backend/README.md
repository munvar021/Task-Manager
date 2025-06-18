# Task Manager Backend API

A RESTful API for managing tasks built with Node.js, Express.js, TypeORM, and SQLite.

## 🚀 Features

- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Filtering**: Filter tasks by status
- **Task Sorting**: Sort tasks by various fields
- **Pagination**: Limit and offset support
- **Task Statistics**: Get overview of task counts
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Structured error responses
- **Security**: Helmet, CORS, and compression middleware
- **Logging**: Request/response logging
- **Database**: SQLite with TypeORM

## 📋 API Endpoints

### Tasks

- `GET /api/v1/tasks` - Get all tasks (with filtering, sorting, pagination)
- `GET /api/v1/tasks/:id` - Get single task by ID
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/:id` - Update existing task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/stats` - Get task statistics

### Health Check

- `GET /health` - Health check endpoint

## 🛠 Installation & Setup

1. **Clone and Navigate**:
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**:
   \`\`\`bash
   cp .env.example .env

   # Edit .env file with your configuration

   \`\`\`

4. **Start Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Start Production Server**:
   \`\`\`bash
   npm start
   \`\`\`

## 📊 Database Schema

### Task Entity

\`\`\`javascript
{
id: UUID (Primary Key)
title: String (Required, max 255 chars)
description: Text (Optional, max 1000 chars)
status: Enum ['todo', 'in_progress', 'done'] (Required, default: 'todo')
dueDate: DateTime (Optional)
createdAt: DateTime (Auto-generated)
updatedAt: DateTime (Auto-updated)
}
\`\`\`

## 🔧 Configuration

Environment variables in `.env`:

\`\`\`env
PORT=3001
NODE_ENV=development
DB_PATH=./database/tasks.sqlite
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000
\`\`\`

## 📝 API Usage Examples

### Create Task

\`\`\`bash
curl -X POST http://localhost:3001/api/v1/tasks \
 -H "Content-Type: application/json" \
 -d '{
"title": "Complete project",
"description": "Finish the task manager project",
"status": "todo",
"dueDate": "2024-12-31T23:59:59.000Z"
}'
\`\`\`

### Get All Tasks

\`\`\`bash
curl http://localhost:3001/api/v1/tasks?status=todo&sortBy=createdAt&sortOrder=DESC&limit=10
\`\`\`

### Update Task

\`\`\`bash
curl -X PUT http://localhost:3001/api/v1/tasks/[task-id] \
 -H "Content-Type: application/json" \
 -d '{
"status": "done"
}'
\`\`\`

### Delete Task

\`\`\`bash
curl -X DELETE http://localhost:3001/api/v1/tasks/[task-id]
\`\`\`

## 🏗 Project Structure

\`\`\`
backend/
├── src/
│ ├── config/
│ │ └── database.js # Database configuration
│ ├── controllers/
│ │ └── taskController.js # Task business logic
│ ├── middleware/
│ │ ├── errorMiddleware.js # Error handling
│ │ ├── loggerMiddleware.js # Request logging
│ │ └── validationMiddleware.js # Input validation
│ ├── models/
│ │ └── Task.js # Task entity model
│ ├── routes/
│ │ └── taskRoutes.js # API routes
│ ├── utils/
│ │ └── responseHelper.js # Response utilities
│ └── index.js # Application entry point
├── database/ # SQLite database files
├── .env # Environment variables
├── .env.example # Environment template
├── .gitignore # Git ignore rules
├── package.json # Dependencies and scripts
└── README.md # Documentation
\`\`\`

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request validation with express-validator
- **Error Handling**: Secure error responses
- **SQL Injection Protection**: TypeORM query builder

## 📈 Performance Features

- **Compression**: Gzip compression
- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Query result caching

## 🧪 Testing

The API can be tested using:

- **Postman**: Import the API endpoints
- **curl**: Command line testing
- **Frontend Integration**: Connect with the Next.js frontend

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Set `synchronize: false` in database config
3. Use process manager like PM2
4. Set up proper logging
5. Configure reverse proxy (nginx)

## 📞 Support

For issues and questions, please check the documentation or create an issue in the repository.
