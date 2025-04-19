import { Request, Response } from 'express';
import Mentor from '../models/Mentor';

export const getMentorProfile = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor profile', error });
  }
};

export const updateMentorProfile = async (req: Request, res: Response) => {
  try {
    // Ensure the user can only update their own profile
    if (req.user?.id !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          location: req.body.location,
          bio: req.body.bio,
          role: req.body.role,
          company: req.body.company,
          batch: req.body.batch,
          branch: req.body.branch,
          expertise: req.body.expertise,
          socialLinks: req.body.socialLinks,
          experience: req.body.experience,
          education: req.body.education,
          privacySettings: req.body.privacySettings,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedMentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(updatedMentor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating mentor profile', error });
  }
};

export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          imageUrl: req.file.path, // Assuming you're using a file upload middleware that saves the file and provides the path
        },
      },
      { new: true }
    );

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({ imageUrl: mentor.imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile image', error });
  }
};

export const updatePrivacySettings = async (req: Request, res: Response) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          privacySettings: req.body.privacySettings,
        },
      },
      { new: true }
    );

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating privacy settings', error });
  }
}; 