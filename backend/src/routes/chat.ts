import express from 'express';
import Chat from '../models/Chat';
import { redactPrivateInfo } from '../utils/privacy';

const router = express.Router();

// Start a new chat
router.post('/', async (req, res) => {
  try {
    const { mentorId, studentId } = req.body;
    
    // Check if chat already exists
    const existingChat = await Chat.findOne({ mentorId, studentId });
    if (existingChat) {
      return res.json(existingChat);
    }

    const chat = new Chat({
      mentorId,
      studentId,
      messages: []
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat' });
  }
});

// Get all chats for a user (either mentor or student)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({
      $or: [
        { studentId: userId },
        { mentorId: userId }
      ]
    }).populate('mentorId', 'name imageUrl role company');

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// Get a specific chat
router.get('/:chatId', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('mentorId', 'name imageUrl role company');
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat' });
  }
});

// Send a message
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { sender, content } = req.body;
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Redact private information before saving
    const redactedContent = redactPrivateInfo(content);
    const isPrivateInfoRedacted = content !== redactedContent;

    chat.messages.push({
      sender,
      content: redactedContent,
      timestamp: new Date(),
      isPrivateInfoRedacted
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

export default router; 