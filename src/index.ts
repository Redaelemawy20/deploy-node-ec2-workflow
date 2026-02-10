import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initDatabase } from './database';
import postsRouter from './routes/posts';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to Posts API',
    endpoints: {
      'GET /api/posts': 'Get all posts',
      'GET /api/posts/:id': 'Get post by ID',
      'POST /api/posts': 'Create new post',
      'PUT /api/posts/:id': 'Update post',
      'DELETE /api/posts/:id': 'Delete post'
    }
  });
});

app.use('/api/posts', postsRouter);

// Initialize database and start server
const startServer = () => {
  try {
    initDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
