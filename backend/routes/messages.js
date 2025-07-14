
import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Send a new message
// @route   POST /api/messages/send
// @access  Private
router.post('/send', protect, async (req, res) => {
  const { text, receiverId } = req.body;
  const senderId = req.user._id;

  if (!text || !receiverId) {
    return res.status(400).json({ message: 'Message text and receiver are required.' });
  }

  try {
    const newMessage = await Message.create({
      text,
      senderId,
      receiverId,
    });
    // In a real-time app, you would emit this message via a WebSocket here.
    res.status(201).json(newMessage.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Server error while sending message.' });
  }
});

// @desc    Get messages between two users
// @route   GET /api/messages/:otherUserId
// @access  Private
router.get('/:otherUserId', protect, async (req, res) => {
  const { otherUserId } = req.params;
  const currentUserId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ timestamp: 1 }); // Sort by timestamp ascending

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching messages.' });
  }
});

export default router;
