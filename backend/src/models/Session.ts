import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  mentor: mongoose.Types.ObjectId;
  user: string; // This will store the Clerk user ID
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const sessionSchema = new Schema({
  mentor: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  user: { type: String, required: true }, // Clerk user ID
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

export default mongoose.model<ISession>('Session', sessionSchema); 