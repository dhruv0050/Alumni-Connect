import express from 'express';
import Session from '../models/Session';

const router = express.Router();

// Get user's sessions
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.params.userId })
      .populate('mentor')
      .sort({ date: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
});

// Book a new session
router.post('/', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    const populatedSession = await session.populate('mentor');
    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(400).json({ message: 'Error booking session' });
  }
});

// Update session status
router.put('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('mentor');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: 'Error updating session' });
  }
});

// Cancel session
router.delete('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('mentor');
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: 'Error cancelling session' });
  }
});

export default router; 