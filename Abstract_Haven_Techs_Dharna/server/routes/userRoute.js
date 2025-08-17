import express from 'express';
import { 
  getAllUsers, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllUsers);

//Get current user profile
router.get('/profile', getUserProfile);

//Update current user profile
router.put('/profile', updateUserProfile);

export default router;
