import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
  };
  likes: Array<{
    userId: string;
    name: string;
  }>;
  comments: Array<{
    content: string;
    author: {
      id: string;
      name: string;
      email: string;
      imageUrl?: string;
    };
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: String
  },
  likes: [{
    userId: { type: String, required: true },
    name: { type: String, required: true }
  }],
  comments: [{
    content: { type: String, required: true },
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      imageUrl: String
    },
    createdAt: { type: Date, default: Date.now }
  }],
}, {
  timestamps: true
});

export default mongoose.model<IPost>('Post', postSchema); 