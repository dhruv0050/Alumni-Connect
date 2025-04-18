import mongoose, { Document, Schema } from 'mongoose';

export interface IMentor extends Document {
  name: string;
  role: string;
  company: string;
  rating: number;
  reviews: number;
  expertise: string[];
  imageUrl: string;
}

const mentorSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  expertise: [{ type: String }],
  imageUrl: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IMentor>('Mentor', mentorSchema); 