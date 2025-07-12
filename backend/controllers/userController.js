const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user.id } });
    res.json(users);
};

exports.addFriend = async (req, res) => {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);
    if (!user.friends.includes(friend._id)) {
        user.friends.push(friend._id);
        await user.save();
    }
    res.json(user.friends);
};

exports.getFriends = async (req, res) => {
    const user = await User.findById(req.user.id).populate('friends');
    res.json(user.friends);
};