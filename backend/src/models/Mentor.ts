import mongoose, { Document, Schema } from 'mongoose';

export interface IMentor extends Document {
  name: string;
  role: string;
  company: string;
  batch: number;
  branch: string;
  location: string;
  expertise: string[];
  imageUrl: string;
}

const mentorSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  batch: { type: Number, required: true },
  branch: { type: String, required: true },
  location: { type: String, required: true },
  expertise: [{ type: String }],
  imageUrl: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IMentor>('Mentor', mentorSchema); 