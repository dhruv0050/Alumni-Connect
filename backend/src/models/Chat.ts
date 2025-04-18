import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  sender: string; // Clerk user ID
  content: string;
  timestamp: Date;
  isPrivateInfoRedacted: boolean;
}

export interface IChat extends Document {
  mentorId: string;
  studentId: string; // Clerk user ID
  messages: IMessage[];
  isActive: boolean;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isPrivateInfoRedacted: { type: Boolean, default: false }
});

const chatSchema = new Schema({
  mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  studentId: { type: String, required: true },
  messages: [messageSchema],
  isActive: { type: Boolean, default: true },
  lastMessageAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Middleware to update lastMessageAt when a new message is added
chatSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastMessageAt = new Date();
  }
  next();
});

export default mongoose.model<IChat>('Chat', chatSchema); 