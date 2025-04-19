import express from 'express';
import Query, { IReply } from '../models/Query';
import User from '../models/User';
import { Types } from 'mongoose';

const router = express.Router();

// Get all queries
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find().sort({ timestamp: -1 });
    res.json(queries);
  } catch (error: any) {
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
    } catch (err: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error('Error updating query likes:', error);
    res.status(500).json({ message: 'Error updating query likes' });
  }
});

// Post a reply to a query
router.post('/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, author } = req.body;
    
    console.log('Received reply request:', {
      queryId: id,
      content,
      author
    });

    const query = await Query.findById(id);
    console.log('Found query:', query ? 'yes' : 'no');
    
    if (!query) {
      console.log('Query not found with ID:', id);
      return res.status(404).json({ message: 'Query not found' });
    }
    
    // Get user's name and role from their Clerk ID
    let authorName = 'Anonymous User';
    let isMentor = false;
    try {
      const user = await User.findOne({ clerkId: author });
      console.log('Found user:', user ? 'yes' : 'no');
      
      if (user) {
        authorName = user.name;
        isMentor = user.role === 'mentor';
      } else {
        console.log('User not found with Clerk ID:', author);
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err: any) {
      console.error('Error finding user:', err);
      return res.status(500).json({ message: 'Error processing request' });
    }
    
    // Add the reply
    query.replies.push({
      author,
      authorName,
      content,
      timestamp: new Date(),
      isMentor // Include the mentor status
    } as IReply);
    
    const updatedQuery = await query.save();
    console.log('Reply added successfully');
    
    res.json(updatedQuery);
  } catch (error: any) {
    console.error('Error adding reply:', error);
    console.error('Error details:', {
      id: req.params.id,
      body: req.body,
      errorMessage: error?.message || 'Unknown error'
    });
    res.status(500).json({ message: 'Error adding reply' });
  }
});

// Get queries by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const queries = await Query.find({ author: userId }).sort({ timestamp: -1 });
    res.json(queries);
  } catch (error: any) {
    console.error('Error fetching user queries:', error);
    res.status(500).json({ message: 'Error fetching user queries' });
  }
});

// Delete a query (only by the author)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // This will be the Clerk ID of the user making the request

    const query = await Query.findById(id);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // Check if the user is the author of the query
    if (query.author !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this query' });
    }

    await Query.findByIdAndDelete(id);
    res.json({ message: 'Query deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting query:', error);
    res.status(500).json({ message: 'Error deleting query' });
  }
});

// Delete a reply (only by the reply author)
router.delete('/:queryId/replies/:replyId', async (req, res) => {
  try {
    const { queryId, replyId } = req.params;
    const { userId } = req.body;

    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }

    // Find the reply using mongoose Types
    const reply = query.replies.find(
      (r) => r._id && r._id.equals(new Types.ObjectId(replyId))
    );

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if the user is the author of the reply
    if (reply.author !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    // Remove the reply using pull
    query.replies = query.replies.filter(r => !r._id.equals(new Types.ObjectId(replyId)));
    await query.save();

    res.json({ message: 'Reply deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ message: 'Error deleting reply' });
  }
});

export default router; 