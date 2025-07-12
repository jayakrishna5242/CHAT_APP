const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/allusers', auth, userController.getAllUsers);
router.post('/add/:id', auth, userController.addFriend);
router.get('/friends', auth, userController.getFriends);

module.exports = router;