import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTask } from '../contexts/TaskContext';

const CreateTaskDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
  });
  const [localError, setLocalError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  const { createTask, users } = useTask();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.assignedTo) {
      setLocalError('All fields are required');
      return;
    }

    setLocalLoading(true);
    const result = await createTask(formData);
    setLocalLoading(false);

    if (result.success) {
      setFormData({ title: '', description: '', assignedTo: '' });
      onClose();
    } else {
      setLocalError(result.error);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', assignedTo: '' });
    setLocalError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      
      <DialogContent>
        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="normal"
          name="title"
          label="Task Title"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <TextField
          margin="normal"
          name="description"
          label="Description"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Assign To</InputLabel>
          <Select
            name="assignedTo"
            value={formData.assignedTo}
            label="Assign To"
            onChange={handleChange}
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={localLoading}
        >
          {localLoading ? <CircularProgress size={24} /> : 'Create Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;
