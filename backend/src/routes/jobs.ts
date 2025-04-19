import express from 'express';
import Job, { JobApplication } from '../models/Job';
import User from '../models/User';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Get a specific job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Error fetching job' });
  }
});

// Post a new job
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      company, 
      location, 
      type, 
      postedBy, 
      requirements, 
      description,
      logo 
    } = req.body;
    
    // Get user's name from their Clerk ID
    let postedByName = 'Anonymous User';
    try {
      const user = await User.findOne({ clerkId: postedBy });
      if (user) {
        postedByName = user.name;
        
        // Only mentors and admins can post jobs
        if (user.role !== 'mentor' && user.role !== 'admin') {
          return res.status(403).json({ message: 'Only mentors can post jobs' });
        }
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ message: 'Error processing request' });
    }
    
    const newJob = new Job({
      title,
      company,
      location,
      type,
      postedBy,
      postedByName,
      requirements: requirements || [],
      description,
      logo,
      applications: [],
      createdAt: new Date()
    });
    
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Error creating job' });
  }
});

// Apply for a job
router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      userId, 
      email, 
      phone, 
      experience, 
      coverLetter,
      resumeUrl 
    } = req.body;
    
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Get user's name from their Clerk ID
    let userName = 'Anonymous User';
    try {
      const user = await User.findOne({ clerkId: userId });
      if (user) {
        userName = user.name;
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ message: 'Error processing request' });
    }
    
    // Check if user has already applied
    const alreadyApplied = job.applications.some(
      application => application.userId === userId
    );
    
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    // Add application directly to the array
    job.applications.push({
      userId,
      userName,
      email,
      phone,
      experience,
      coverLetter,
      resumeUrl,
      status: 'pending',
      appliedAt: new Date()
    } as any); // Using type assertion to handle Mongoose document
    
    const updatedJob = await job.save();
    
    res.status(201).json({ message: 'Application submitted successfully', job: updatedJob });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: 'Error applying for job' });
  }
});

// Get all applications for a job (for job poster only)
router.get('/:id/applications', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Clerk ID of the requester
    
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Verify the requester is the job poster or an admin
    if (job.postedBy !== userId) {
      const user = await User.findOne({ clerkId: userId as string });
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view applications' });
      }
    }
    
    res.json(job.applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: 'Error fetching job applications' });
  }
});

// Get applications by user ID
router.get('/applications/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all jobs with applications from this user
    const jobs = await Job.find({
      'applications.userId': userId
    });
    
    // Extract just the user's applications with job details
    const applications = jobs.map(job => {
      const userApplications = job.applications.filter(app => app.userId === userId);
      return userApplications.map(app => ({
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        application: app
      }));
    }).flat();
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ message: 'Error fetching user applications' });
  }
});

export default router; 