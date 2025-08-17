import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
} from '@mui/material';
import {
  Add as AddIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { usersAPI } from '../services/api';
import CreateTaskDialog from './CreateTaskDialog';
import TaskDetailsDialog from './TaskDetailsDialog';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    updateTask, 
    deleteTask, 
    setUsers, 
    clearError 
  } = useTask();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchTasks(statusFilter);
  }, [statusFilter]);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await updateTask(task._id, { status: newStatus });
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  const canEditTask = (task) => {
    return task.createdBy._id === user._id || task.assignedTo._id === user._id;
  };

  const canDeleteTask = (task) => {
    return task.createdBy._id === user._id;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Team Collaboration Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuClick}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            My Tasks
          </Typography>
          <Box display="flex" gap={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Task
            </Button>
          </Box>
        </Box>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 }
                }}
                onClick={() => handleTaskClick(task)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h2" noWrap>
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {task.description}
                  </Typography>
                  
                  <Box mt={2}>
                    <Typography variant="caption" display="block">
                      Created by: {task.createdBy.name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Assigned to: {task.assignedTo.name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Box>
                      {canEditTask(task) && (
                        <Button
                          size="small"
                          color={task.status === 'pending' ? 'success' : 'warning'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(task);
                          }}
                        >
                          Mark as {task.status === 'pending' ? 'Completed' : 'Pending'}
                        </Button>
                      )}
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                      >
                        <CommentIcon />
                      </IconButton>
                      {canDeleteTask(task) && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task._id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {tasks.length === 0 && !loading && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No tasks found. Create your first task!
            </Typography>
          </Box>
        )}
      </Container>

      <CreateTaskDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <TaskDetailsDialog
        open={taskDetailsOpen}
        onClose={() => setTaskDetailsOpen(false)}
        task={selectedTask}
      />
    </>
  );
};

export default Dashboard;
