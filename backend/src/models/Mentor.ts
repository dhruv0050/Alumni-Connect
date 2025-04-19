import mongoose, { Document, Schema } from 'mongoose';

export interface IMentor extends Document {
  // Personal Information
  name: string;
  email: string;
  imageUrl: string;
  bio: string;
  phone?: string;
  location: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  
  // Professional Information
  role: string;
  company: string;
  batch: number;
  branch: string;
  expertise: string[];
  experience: Array<{
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }>;
  
  // Education
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  
  // Privacy Settings
  privacySettings: {
    email: boolean;
    phone: boolean;
    location: boolean;
    socialLinks: boolean;
    experience: boolean;
    education: boolean;
  };
}

const mentorSchema = new Schema({
  // Personal Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  bio: { type: String, default: '' },
  phone: { type: String },
  location: { type: String, required: true },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    website: String
  },
  
  // Professional Information
  role: { type: String, required: true },
  company: { type: String, required: true },
  batch: { type: Number, required: true },
  branch: { type: String, required: true },
  expertise: [{ type: String }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    description: String
  }],
  
  // Education
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true }
  }],
  
  // Privacy Settings
  privacySettings: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    location: { type: Boolean, default: true },
    socialLinks: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    education: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<IMentor>('Mentor', mentorSchema); 