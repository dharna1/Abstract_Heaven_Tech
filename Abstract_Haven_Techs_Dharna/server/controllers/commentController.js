import Comment from '../models/comment.js';
import Task from '../models/task.js';

// Add a comment to a task
export const addComment = async (req, res) => {
  const { id } = req.params; // Task ID
  const { text } = req.body;

  try {
    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task (creator or assigned user)
    if (task.createdBy.toString() !== req.user.id && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only comment on tasks you created or are assigned to.' });
    }

    const newComment = await Comment.create({
      text,
      taskId: id,
      userId: req.user.id
    });

    // Populate the comment with user details
    const populatedComment = await Comment.findById(newComment._id)
      .populate('userId', 'name email');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all comments for a task
export const getComments = async (req, res) => {
  const { id } = req.params; // Task ID

  try {
    // Check if task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to this task
    if (task.createdBy.toString() !== req.user.id && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only view comments on tasks you created or are assigned to.' });
    }

    const comments = await Comment.find({ taskId: id })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 }); // Sort by oldest first

    res.status(200).json({
      message: 'Comments retrieved successfully',
      comments
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a comment (only the comment author can update)
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own comments.' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment (only the comment author can delete)
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only delete your own comments.' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: 'Comment deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
