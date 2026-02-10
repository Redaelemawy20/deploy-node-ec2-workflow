import { Router, Request, Response } from 'express';
import { dbRun, dbGet, dbAll } from '../database';
import { CreatePostRequest, UpdatePostRequest, Post } from '../types';

const router = Router();

// Get all posts
router.get('/', (req: Request, res: Response) => {
  try {
    const posts = dbAll('SELECT * FROM posts ORDER BY created_at DESC');
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});

// Get post by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
  }
});

// Create new post
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, content, author }: CreatePostRequest = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and content are required' 
      });
    }
    
    const result = dbRun(
      'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
      [title, content, author || null]
    );
    
    const newPost = dbGet(
      'SELECT * FROM posts WHERE id = ?',
      [result.lastID]
    );
    
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
});

// Update post
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, author }: UpdatePostRequest = req.body;
    
    // Check if post exists
    const existingPost = dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    if (!existingPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (author !== undefined) {
      updates.push('author = ?');
      values.push(author);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No fields to update' 
      });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    dbRun(
      `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    const updatedPost = dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    res.json({ success: true, data: updatedPost });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingPost = dbGet('SELECT * FROM posts WHERE id = ?', [id]);
    if (!existingPost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    dbRun('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

export default router;
