import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import Post from '../models/Post';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Create a new post
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { content, author } = req.body;
    const post = new Post({
      content,
      author,
      likes: [],
      comments: []
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Like a post
router.post('/:postId/like', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { userId, name } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = post.likes.find(like => like.userId === userId);
    if (existingLike) {
      // Unlike if already liked
      post.likes = post.likes.filter(like => like.userId !== userId);
    } else {
      // Add like
      post.likes.push({ userId, name });
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post likes' });
  }
});

// Add a comment to a post
router.post('/:postId/comments', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { content, author } = req.body;
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      content,
      author,
      createdAt: new Date()
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

export default router; 