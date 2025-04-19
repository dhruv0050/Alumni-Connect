import express from 'express';
import Query, { IReply } from '../models/Query';
import User from '../models/User';

const router = express.Router();

// Get all queries
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().sort({ timestamp: -1 });
    res.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ message: 'Error fetching queries' });
  }
});

// Post a new query
router.post('/', async (req, res) => {
  try {
    const { title, content, tags, author } = req.body;
    
    // Get user's name from their Clerk ID
    let authorName = 'Anonymous User';
    try {
      const user = await User.findOne({ clerkId: author });
      if (user) {
        authorName = user.name;
      }
    } catch (err) {
      console.error('Error finding user:', err);
      // Continue with default name if user not found
    }
    
    const newQuery = new Query({
      author,
      authorName,
      title,
      content,
      likes: 0,
      likedBy: [],
      replies: [],
      tags: tags || [],
      timestamp: new Date()
    });
    
    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({ message: 'Error creating query' });
  }
});

// Like or unlike a query
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    
    // Check if user has already liked the query
    const alreadyLiked = query.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike: Remove user from likedBy and decrement likes
      query.likedBy = query.likedBy.filter(id => id !== userId);
      query.likes -= 1;
      if (query.likes < 0) query.likes = 0; // Safeguard against negative likes
    } else {
      // Like: Add user to likedBy and increment likes
      query.likedBy.push(userId);
      query.likes += 1;
    }
    
    const updatedQuery = await query.save();
    res.json(updatedQuery);
  } catch (error) {
    console.error('Error updating query likes:', error);
    res.status(500).json({ message: 'Error updating query likes' });
  }
});

// Post a reply to a query
router.post('/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;
    
    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    
    // Get user's name from their Clerk ID
    let authorName = 'Anonymous User';
    try {
      const user = await User.findOne({ clerkId: author });
      if (user) {
        authorName = user.name;
        
        // Check if user is a mentor (only mentors can reply)
        if (user.role !== 'mentor' && user.role !== 'admin') {
          return res.status(403).json({ message: 'Only mentors can reply to queries' });
        }
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ message: 'Error processing request' });
    }
    
    // Add the reply - use the correct type structure
    query.replies.push({
      author,
      authorName,
      content,
      timestamp: new Date()
    } as IReply);
    
    const updatedQuery = await query.save();
    
    res.json(updatedQuery);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Error adding reply' });
  }
});

// Get queries by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const queries = await Query.find({ author: userId }).sort({ timestamp: -1 });
    res.json(queries);
  } catch (error) {
    console.error('Error fetching user queries:', error);
    res.status(500).json({ message: 'Error fetching user queries' });
  }
});

export default router; 