import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  userId: string; // Clerk user ID
  userName: string;
  email: string;
  phone?: string;
  experience: string;
  coverLetter: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedAt: Date;
}

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: string; // Full-time, Part-time, Contract, etc.
  postedBy: string; // Clerk user ID
  postedByName: string;
  requirements: string[];
  description: string;
  logo?: string;
  applications: IJobApplication[];
  createdAt: Date;
}

const jobApplicationSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  experience: { type: String, required: true },
  coverLetter: { type: String, required: true },
  resumeUrl: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'rejected', 'accepted'], 
    default: 'pending' 
  },
  appliedAt: { type: Date, default: Date.now }
});

const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  postedBy: { type: String, required: true },
  postedByName: { type: String, required: true },
  requirements: [{ type: String }],
  description: { type: String, required: true },
  logo: { type: String },
  applications: [jobApplicationSchema],
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
export default mongoose.model<IJob>('Job', jobSchema); 