# Node SQLite Posts API

A simple Express.js API with TypeScript for CRUD operations on posts using SQLite database.

## Features

- ✅ TypeScript support
- ✅ Express.js REST API
- ✅ SQLite database (better-sqlite3)
- ✅ CRUD operations for posts
- ✅ CORS enabled
- ✅ Auto-reload during development
- ✅ Synchronous database operations

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API Endpoints

### Get all posts
```
GET /api/posts
```

### Get post by ID
```
GET /api/posts/:id
```

### Create new post
```
POST /api/posts
Content-Type: application/json

{
  "title": "My Post Title",
  "content": "Post content here",
  "author": "John Doe" // optional
}
```

### Update post
```
PUT /api/posts/:id
Content-Type: application/json

{
  "title": "Updated Title", // optional
  "content": "Updated content", // optional
  "author": "Jane Doe" // optional
}
```

### Delete post
```
DELETE /api/posts/:id
```

## Database Schema

```sql
posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Example Usage

```bash
# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"First Post","content":"Hello World","author":"John"}'

# Get all posts
curl http://localhost:3000/api/posts

# Get specific post
curl http://localhost:3000/api/posts/1

# Update post
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Post"}'

# Delete post
curl -X DELETE http://localhost:3000/api/posts/1
```
