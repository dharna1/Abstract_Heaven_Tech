import express from 'express';
import { 
  addComment, 
  getComments, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// POST /tasks/:id/comments - Add a comment to a task
router.post('/tasks/:id/comments', addComment);

// GET /tasks/:id/comments - Get all comments for a task
router.get('/tasks/:id/comments', getComments);

// PUT /comments/:commentId - Update a comment
router.put('/comments/:commentId', updateComment);

// DELETE /comments/:commentId - Delete a comment
router.delete('/comments/:commentId', deleteComment);

export default router;
