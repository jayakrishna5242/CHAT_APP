
import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all users except the logged-in one
// @route   GET /api/users/all
// @access  Private
router.get('/all', protect, async (req, res) => {
    try {
        // req.user is attached by the 'protect' middleware
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/friends', protect, async (req, res) => {
  try {
    // Fetch user and populate the 'friends' field
    const userWithFriends = await User.findById(req.user._id)
      .populate('friends', '-password -__v') // exclude sensitive fields
      .select('friends'); // only return friends field

    if (!userWithFriends) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userWithFriends.friends); // send populated friends array
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.body;

    // Validate input
    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required in request body.' });
    }

    // Prevent adding self
    if (userId.toString() === friendId) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend.' });
    }

    // Find both users
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or Friend not found.' });
    }

    // Check if already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'User is already a friend.' });
    }

    // Add friendId to user's friends
    user.friends.push(friendId);
    await user.save();

    // Optional: add user to friend's friends list for two-way friendship
    // friend.friends.push(userId);
    // await friend.save();

    res.status(200).json({ message: 'Friend added successfully.' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


export default router;
