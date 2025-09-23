# API Builder
[![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?style=flat&logo=swagger&logoColor=white)](https://gdstp.github.io/api-builder/)
[![Coverage](https://gdstp.github.io/api-builder/badges/coverage.svg)](https://gdstp.github.io/api-builder/coverage)
[![CI](https://github.com/gdstp/api-builder/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/gdstp/api-builder-ga/actions/workflows/ci.yml)

A comprehensive Node.js API with authentication and user management built with TypeScript, Express, Prisma, and PostgreSQL.

## Features

- 🔐 JWT-based authentication with refresh tokens
- 👤 User registration and profile management
- 🛡️ Input validation with Zod schemas
- 📚 OpenAPI/Swagger documentation
- 🐳 Docker development environment
- 🧪 Comprehensive testing (unit, integration, e2e)
- 🔒 Security middleware with Helmet
- 📊 Structured logging with Winston
- 🔄 Database migrations with Prisma

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Testing**: Vitest
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Clone the repository

```bash 
git clone <repository-url>
cd api-builder
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_USER=apibuilder
POSTGRES_PASSWORD=password123
POSTGRES_DB=apibuilder_dev
DATABASE_URL=postgresql://apibuilder:password123@api-builder-db:5432/apibuilder_dev

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
REFRESH_JWT_SECRET=your-super-secret-refresh-jwt-key-here

# Security
SALT_ROUNDS=12

# Server Configuration
API_PORT=8000
NODE_ENV=development
```

Create a `.env.test` file for testing:

```env
# Test Database Configuration
POSTGRES_TEST_USER=apibuilder_test
POSTGRES_TEST_PASSWORD=testpassword123
POSTGRES_TEST_DB=apibuilder_test
DATABASE_URL=postgresql://apibuilder_test:testpassword123@localhost:5433/apibuilder_test

# JWT Configuration (same as development for testing)
JWT_SECRET=test-jwt-secret-key
REFRESH_JWT_SECRET=test-refresh-jwt-secret-key

# Security
SALT_ROUNDS=12

# Server Configuration
API_PORT=8000
NODE_ENV=test
```

### 3. Development with Docker (Recommended)

Start the development environment:

```bash
docker-compose up --build
```

This will:
- Start a PostgreSQL database
- Run database migrations
- Start the API server in development mode with hot reload
- Make the API available at `http://localhost:8000`

## API Endpoints

Check [documentation](https://gdstp.github.io/api-builder) for more details. <br/>
The API is available at `http://localhost:8000/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/user/sign-up` | Register a new user | No |
| POST | `/user/sign-in` | Sign in user | No |
| POST | `/user/profile` | Get user profile | Yes |

### API Documentation

Interactive API documentation is available at:
- **Swagger UI**: `http://localhost:8000/api-docs`

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:8000/api/v1/user/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Sign in

```bash
curl -X POST http://localhost:8000/api/v1/user/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get user profile (requires authentication)

```bash
curl -X POST http://localhost:8000/api/v1/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing

The project includes comprehensive tests at multiple levels:

### Run all tests

```bash
npm run test:all:coverage
```

### Run specific test suites

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

### Test Structure

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints and middleware
- **E2E Tests**: Test complete user workflows

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Run type checking and linting
npm run typecheck

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio
```

### Project Structure
```
src/
├── @types/ # TypeScript type definitions
├── controllers/ # Request handlers
├── lib/ # Configuration and utilities
├── middlewares/ # Express middlewares
├── repositories/ # Data access layer
├── routes/ # Route definitions
├── schemas/ # Validation schemas
├── services/ # External libs / connections
└── utils/ # Helper functions
tests/
├── unit/ # Unit tests
├── integration/ # Integration tests
└── e2e/ # End-to-end tests
```

## Production Deployment

### Environment Variables

Ensure these environment variables are set in production:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Strong secret for JWT tokens
- `REFRESH_JWT_SECRET`: Strong secret for refresh tokens
- `SALT_ROUNDS`: Number of bcrypt salt rounds (recommended: 12+)
- `API_PORT`: Port for the API server
- `NODE_ENV`: Set to "production"

### Docker Production Build

```bash
# Build production image
docker build -t api-builder .

# Run with production environment
docker run -p 8000:8000 --env-file .env.production api-builder
```