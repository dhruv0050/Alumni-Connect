import express from 'express';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import {
  getMentorProfile,
  updateMentorProfile,
  uploadProfileImage,
  updatePrivacySettings,
} from '../controllers/mentorController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Public routes
router.get('/:id', getMentorProfile);

// Protected routes
router.patch('/:id', authenticateToken, updateMentorProfile);
router.patch('/:id/privacy', authenticateToken, updatePrivacySettings);
router.post('/:id/image', authenticateToken, upload.single('image'), uploadProfileImage);

export default router; 