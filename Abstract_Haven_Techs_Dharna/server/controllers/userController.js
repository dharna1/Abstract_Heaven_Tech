import User from '../models/user.js';

// Get all users (for task assignment)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role').sort({ name: 1 });
    
    res.status(200).json({
      message: 'Users retrieved successfully',
      users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'name email role createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if email already exists (excluding current user)
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('name email role createdAt');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
