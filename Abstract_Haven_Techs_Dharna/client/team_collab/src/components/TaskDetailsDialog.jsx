import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTask } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';

const TaskDetailsDialog = ({ open, onClose, task }) => {
  const [comment, setComment] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { 
    comments, 
    fetchTaskComments, 
    addComment, 
    updateTask,
    error 
  } = useTask();
  const { user } = useAuth();

  useEffect(() => {
    if (open && task) {
      fetchTaskComments(task._id);
    }
  }, [open, task]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const result = await addComment(task._id, comment);
    if (result.success) {
      setComment('');
    } else {
      setLocalError(result.error);
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await updateTask(task._id, { status: newStatus });
  };

  const canEditTask = () => {
    return task && user && (task.createdBy._id === user._id || task.assignedTo._id === user._id);
  };

  const handleClose = () => {
    setComment('');
    setLocalError('');
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{task.title}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" gutterBottom>
              Task Details
            </Typography>
            <Chip
              label={task.status}
              color={task.status === 'completed' ? 'success' : 'warning'}
            />
          </Box>
          
          <Typography variant="body1" paragraph>
            {task.description}
          </Typography>

          <Box display="flex" gap={2} mb={2}>
            <Typography variant="body2" color="text.secondary">
              <strong>Created by:</strong> {task.createdBy.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Assigned to:</strong> {task.assignedTo.name}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            <strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}
          </Typography>

          {canEditTask() && (
            <Box mt={2}>
              <Button
                variant="outlined"
                color={task.status === 'pending' ? 'success' : 'warning'}
                onClick={handleStatusToggle}
              >
                Mark as {task.status === 'pending' ? 'Completed' : 'Pending'}
              </Button>
            </Box>
          )}
        </Box>

        <Divider />

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Comments ({comments.length})
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {localError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError}
            </Alert>
          )}

          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {comments.map((comment) => (
              <ListItem key={comment._id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {comment.userId.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={comment.text}
                />
              </ListItem>
            ))}
          </List>

          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
              No comments yet. Be the first to comment!
            </Typography>
          )}

          <Box component="form" onSubmit={handleAddComment} mt={2}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={2}
                variant="outlined"
                size="small"
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!comment.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;
