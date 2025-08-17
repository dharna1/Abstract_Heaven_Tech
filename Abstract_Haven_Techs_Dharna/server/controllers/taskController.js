import Task from '../models/task.js';
import User from '../models/user.js';

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  try {
    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const newTask = await Task.create({
      title,
      description,
      createdBy: req.user.id,
      assignedTo
    });

    // Populate the task with user details
    const populatedTask = await Task.findById(newTask._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tasks for logged-in user (created by them or assigned to them)
export const getTasks = async (req, res) => {
  const { status } = req.query;

  try {
    let filter = {
      $or: [
        { createdBy: req.user.id },
        { assignedTo: req.user.id }
      ]
    };

    // Add status filter if provided
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update task details or status
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignedTo } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to update (creator or assigned user)
    if (task.createdBy.toString() !== req.user.id && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only update tasks created by you or assigned to you.' });
    }

    // If assignedTo is being changed, verify the new user exists
    if (assignedTo && assignedTo !== task.assignedTo.toString()) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a task (only creator can delete)
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only creator can delete
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Only the task creator can delete this task.' });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific task by ID
export const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    if (task.createdBy._id.toString() !== req.user.id && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only view tasks created by you or assigned to you.' });
    }

    res.status(200).json({
      message: 'Task retrieved successfully',
      task
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
