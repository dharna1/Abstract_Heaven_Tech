import React, { createContext, useContext, useReducer } from 'react';
import { tasksAPI, commentsAPI } from '../services/api';

const TaskContext = createContext();

const initialState = {
  tasks: [],
  currentTask: null,
  comments: [],
  users: [],
  loading: false,
  error: null,
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'SET_CURRENT_TASK':
      return { ...state, currentTask: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        currentTask: state.currentTask?._id === action.payload._id ? action.payload : state.currentTask,
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        currentTask: state.currentTask?._id === action.payload ? null : state.currentTask,
      };
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };
    case 'ADD_COMMENT':
      return { ...state, comments: [...state.comments, action.payload] };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const fetchTasks = async (status = '') => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks(status);
      dispatch({ type: 'SET_TASKS', payload: response.data.tasks });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  const createTask = async (taskData) => {
    try {
      setLoading(true);
      const response = await tasksAPI.createTask(taskData);
      dispatch({ type: 'ADD_TASK', payload: response.data.task });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const response = await tasksAPI.updateTask(taskId, taskData);
      dispatch({ type: 'UPDATE_TASK', payload: response.data.task });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const fetchTaskComments = async (taskId) => {
    try {
      const response = await commentsAPI.getComments(taskId);
      dispatch({ type: 'SET_COMMENTS', payload: response.data.comments });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch comments');
    }
  };

  const addComment = async (taskId, commentText) => {
    try {
      const response = await commentsAPI.addComment(taskId, { text: commentText });
      dispatch({ type: 'ADD_COMMENT', payload: response.data.comment });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const setCurrentTask = (task) => {
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
  };

  const setUsers = (users) => {
    dispatch({ type: 'SET_USERS', payload: users });
  };

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        fetchTaskComments,
        addComment,
        setCurrentTask,
        setUsers,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
