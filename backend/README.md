# Backend README - Smart Study Planner

Backend API server for the Smart Study Planner with Deadlines project.

## Overview

This backend is built with Node.js + Express and provides:
- User authentication (register/login)
- JWT-secured task APIs
- User-isolated task data in MongoDB
- CRUD operations for academic tasks

The server exposes REST endpoints consumed by the React frontend.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- CORS + dotenv

## Core Features

### 1. Authentication
- Register new users
- Login existing users
- Password hashing before storage
- JWT generation on successful login (expires in 7 days)

### 2. Protected Task Operations
All task routes are protected with Bearer token middleware.

- Create task
- Get all tasks for logged-in user
- Update task by id
- Delete task by id

### 3. Data Isolation Per User
Task queries are scoped by `userId` (taken from verified JWT), ensuring each user can access only their own tasks.

## Server Flow

1. Load environment variables with dotenv
2. Connect to MongoDB via `MONGO_URI`
3. Register middleware (`cors`, `express.json`)
4. Mount routes:
   - `/api/auth`
   - `/api/tasks`
5. Start server on `PORT` (default 5000)

## API Routes

### Base URL

```text
http://localhost:5000/api
```

### Auth Routes

#### POST `/auth/register`
Register a new user.

Request body:

```json
{
  "name": "Nishant",
  "email": "nishant@example.com",
  "password": "Password1"
}
```

Responses:
- `201`: `{ "message": "User registered successfully" }`
- `400`: `{ "message": "User already exists" }`
- `500`: `{ "error": "..." }`

#### POST `/auth/login`
Authenticate user and return token.

Request body:

```json
{
  "email": "nishant@example.com",
  "password": "Password1"
}
```

Successful response:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "Nishant",
    "email": "nishant@example.com"
  }
}
```

Possible errors:
- `400`: invalid credentials
- `500`: server error

### Task Routes (Protected)

All routes below require:

```http
Authorization: Bearer <token>
```

#### POST `/tasks`
Create a task for the logged-in user.

Accepted fields:
- `title`
- `subject`
- `deadline`
- `priority`
- `notes`

Response:
- `201` created task object

#### GET `/tasks`
Fetch all tasks of logged-in user (sorted by latest created first).

Response:
- `200` array of tasks

#### PUT `/tasks/:id`
Update task fields for a user-owned task.

Response:
- `200` updated task object
- `404` task not found

#### DELETE `/tasks/:id`
Delete a user-owned task.

Response:
- `200` `{ "message": "Task deleted" }`
- `404` task not found

## Middleware

### `protect` auth middleware
- Extracts token from `Authorization` header
- Verifies token using `JWT_SECRET`
- Injects `req.user = decoded.id`
- Returns `401` on missing/invalid token

## Data Models

### User
Fields:
- `name` (required)
- `email` (required, unique)
- `password` (required)
- timestamps

### Task
Fields:
- `title`
- `subject`
- `deadline` (Date)
- `priority`
- `status` (default: `pending`)
- `notes`
- `userId` (ObjectId ref User)
- timestamps

## Environment Variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

## Run Locally

```bash
npm install
npm run dev
```

For production mode:

```bash
npm start
```

## Health Check

Root route:

```http
GET /
```

Returns:

```text
API Running...
```
