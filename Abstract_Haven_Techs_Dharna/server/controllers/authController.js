import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      ...(role && { role }) // Only include role if provided, otherwise use default
    });
    console.log('New user created:', newUser);

    // Remove password from response
    const { password: _, ...userResponse } = newUser.toObject();

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Remove password from response
    const { password: _, ...userResponse } = user.toObject();

    res.status(200).json({ 
      message: 'Login successful',
      user: userResponse, 
      token 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};