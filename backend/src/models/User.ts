import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  headline?: string;
  about?: string;
  skills: string[];
  experience: {
    _id?: Types.ObjectId;
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }[];
  education: {
    _id?: Types.ObjectId;
    school: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }[];
  role: 'user' | 'mentor' | 'admin';
  imageUrl?: string;
}

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  headline: { type: String },
  about: { type: String },
  skills: [{ type: String }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String }
  }],
  education: [{
    school: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number }
  }],
  role: { 
    type: String, 
    required: true, 
    enum: ['user', 'mentor', 'admin'],
    default: 'user'
  },
  imageUrl: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema); 