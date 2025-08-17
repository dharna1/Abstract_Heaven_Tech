import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config'; 
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import taskRoutes from './routes/taskRoute.js';
import commentRoutes from './routes/commentRoute.js';
import userRoutes from './routes/userRoute.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/', commentRoutes); 

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'Team Collaboration API is running!', 
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});