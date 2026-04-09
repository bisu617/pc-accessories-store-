import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        cart: user.cart,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        cart: user.cart,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// GET /api/auth/profile
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id)
      .populate('cart.product')
      .populate('wishlist');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
