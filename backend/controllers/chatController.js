const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    const { friendId } = req.params;
    const messages = await Message.find({
        $or: [
            { sender: req.user.id, receiver: friendId },
            { sender: friendId, receiver: req.user.id }
        ]
    });
    res.json(messages);
};

exports.sendMessage = async (req, res) => {
    const { receiver, text } = req.body;
    const message = new Message({ sender: req.user.id, receiver, text });
    await message.save();
    res.status(201).json(message);
};