import express from 'express';
import User, { IUser } from '../models/User';
import { Types } from 'mongoose';

const router = express.Router();

// Get user profile by Clerk ID
router.get('/:clerkId', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create or update user profile
router.post('/', async (req, res) => {
  try {
    const { 
      clerkId, 
      name, 
      email, 
      headline, 
      about, 
      skills,
      experience,
      education,
      role,
      imageUrl 
    } = req.body;
    
    if (!clerkId || !name || !email) {
      return res.status(400).json({ message: 'ClerkId, name, and email are required' });
    }
    
    // Find existing user or create new one
    let user = await User.findOne({ clerkId });
    
    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      if (headline !== undefined) user.headline = headline;
      if (about !== undefined) user.about = about;
      if (skills !== undefined) user.skills = skills;
      if (experience !== undefined) user.experience = experience;
      if (education !== undefined) user.education = education;
      if (imageUrl !== undefined) user.imageUrl = imageUrl;
      // Only admins should be able to change roles, but we're simplifying for now
      if (role !== undefined) user.role = role;
    } else {
      // Create new user
      user = new User({
        clerkId,
        name,
        email,
        headline: headline || '',
        about: about || '',
        skills: skills || [],
        experience: experience || [],
        education: education || [],
        role: role || 'user',
        imageUrl: imageUrl || ''
      });
    }
    
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user' });
  }
});

// Add a new skill
router.post('/:clerkId/skills', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const { skill } = req.body;
    
    if (!skill) {
      return res.status(400).json({ message: 'Skill is required' });
    }
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if skill already exists
    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }
    
    res.json(user.skills);
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ message: 'Error adding skill' });
  }
});

// Remove a skill
router.delete('/:clerkId/skills/:skill', async (req, res) => {
  try {
    const { clerkId, skill } = req.params;
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.skills = user.skills.filter(s => s !== skill);
    await user.save();
    
    res.json(user.skills);
  } catch (error) {
    console.error('Error removing skill:', error);
    res.status(500).json({ message: 'Error removing skill' });
  }
});

// Add experience
router.post('/:clerkId/experience', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const experience = req.body;
    
    if (!experience.title || !experience.company || !experience.startDate) {
      return res.status(400).json({ 
        message: 'Title, company, and start date are required' 
      });
    }
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.experience.push(experience);
    await user.save();
    
    res.json(user.experience);
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ message: 'Error adding experience' });
  }
});

// Update or delete experience
router.put('/:clerkId/experience/:expId', async (req, res) => {
  try {
    const { clerkId, expId } = req.params;
    const updatedExp = req.body;
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the experience entry by ID
    const expIndex = user.experience.findIndex(
      // Use type assertion to handle MongoDB ObjectId
      exp => (exp as any)._id && (exp as any)._id.toString() === expId
    );
    
    if (expIndex === -1) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    
    // If delete flag is set, remove the entry
    if (updatedExp._delete) {
      user.experience.splice(expIndex, 1);
    } else {
      // Update the entry with new values
      if (updatedExp.title) user.experience[expIndex].title = updatedExp.title;
      if (updatedExp.company) user.experience[expIndex].company = updatedExp.company;
      if (updatedExp.location) user.experience[expIndex].location = updatedExp.location;
      if (updatedExp.startDate) user.experience[expIndex].startDate = new Date(updatedExp.startDate);
      if (updatedExp.endDate) user.experience[expIndex].endDate = new Date(updatedExp.endDate);
      if (updatedExp.description) user.experience[expIndex].description = updatedExp.description;
    }
    
    await user.save();
    res.json(user.experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ message: 'Error updating experience' });
  }
});

// Similar routes for education
router.post('/:clerkId/education', async (req, res) => {
  try {
    const { clerkId } = req.params;
    const education = req.body;
    
    if (!education.school || !education.degree || !education.field || !education.startYear) {
      return res.status(400).json({ 
        message: 'School, degree, field, and start year are required' 
      });
    }
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.education.push(education);
    await user.save();
    
    res.json(user.education);
  } catch (error) {
    console.error('Error adding education:', error);
    res.status(500).json({ message: 'Error adding education' });
  }
});

router.put('/:clerkId/education/:eduId', async (req, res) => {
  try {
    const { clerkId, eduId } = req.params;
    const updatedEdu = req.body;
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the education entry by ID
    const eduIndex = user.education.findIndex(
      // Use type assertion to handle MongoDB ObjectId
      edu => (edu as any)._id && (edu as any)._id.toString() === eduId
    );
    
    if (eduIndex === -1) {
      return res.status(404).json({ message: 'Education not found' });
    }
    
    // If delete flag is set, remove the entry
    if (updatedEdu._delete) {
      user.education.splice(eduIndex, 1);
    } else {
      // Update the entry with new values
      if (updatedEdu.school) user.education[eduIndex].school = updatedEdu.school;
      if (updatedEdu.degree) user.education[eduIndex].degree = updatedEdu.degree;
      if (updatedEdu.field) user.education[eduIndex].field = updatedEdu.field;
      if (updatedEdu.startYear) user.education[eduIndex].startYear = updatedEdu.startYear;
      if (updatedEdu.endYear) user.education[eduIndex].endYear = updatedEdu.endYear;
    }
    
    await user.save();
    res.json(user.education);
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).json({ message: 'Error updating education' });
  }
});

// Check if user is a mentor
router.get('/check-mentor/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('\n=== Mentor Check Request ===');
    console.log('Email:', email);
    
    // Hardcoded mentor emails
    const mentorEmails = [
      'arjun.patel@polygon.technology',
      'priya.sharma@amazon.com'
    ];
    
    // First check hardcoded list
    const isInList = mentorEmails.includes(email);
    console.log('Is in mentor list:', isInList);
    
    // Then check database
    const user = await User.findOne({ email });
    console.log('User found in database:', !!user);
    console.log('User details:', user);
    
    // Force mentor status for specific email
    const isMentor = isInList;
    console.log('Final mentor status:', isMentor);
    
    // Update user in database if needed
    if (user && user.role !== 'mentor' && isMentor) {
      console.log('Updating user role to mentor in database');
      user.role = 'mentor';
      await user.save();
      console.log('User role updated successfully');
    }
    
    // Clear response
    const response = {
      isMentor,
      email,
      source: isInList ? 'hardcoded_list' : 'database',
      role: user?.role || 'not_found'
    };
    
    console.log('Sending response:', response);
    console.log('=========================\n');
    
    res.json(response);
  } catch (error: any) {
    console.error('Error in check-mentor:', error);
    res.status(500).json({ 
      message: 'Error checking mentor status', 
      error: error.message 
    });
  }
});

export default router; 