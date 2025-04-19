import mongoose, { Document, Schema } from 'mongoose';

export interface IReply extends Document {
  author: string; // Clerk user ID
  authorName: string;
  content: string;
  timestamp: Date;
}

export interface IQuery extends Document {
  author: string; // Clerk user ID
  authorName: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[]; // Array of Clerk user IDs
  replies: IReply[];
  tags: string[];
  timestamp: Date;
}

const replySchema = new Schema({
  author: { type: String, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const querySchema = new Schema({
  author: { type: String, required: true },
  authorName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Store user IDs who liked the query
  replies: [replySchema],
  tags: [{ type: String }],
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.model<IQuery>('Query', querySchema); 