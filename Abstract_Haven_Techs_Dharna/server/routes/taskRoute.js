import express from 'express';
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask, 
  getTaskById 
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

//Create a new task
router.post('/', createTask);

//Get all tasks for the logged-in user (with optional status filter)
router.get('/', getTasks);

//Get a specific task by ID
router.get('/:id', getTaskById);

//Update task details or status
router.put('/:id', updateTask);

//Delete a task
router.delete('/:id', deleteTask);

export default router;
