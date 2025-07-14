
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent'
  }
}, {
  timestamps: { createdAt: 'timestamp' }, // use 'timestamp' to match frontend type
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.updatedAt;
    }
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
