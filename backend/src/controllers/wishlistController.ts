import { Response } from 'express';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

// GET /api/wishlist
export const getWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate('wishlist');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/wishlist/:productId
export const toggleWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const index = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    let message: string;
    if (index === -1) {
      user.wishlist.push(productId as any);
      message = 'Added to wishlist';
    } else {
      user.wishlist.splice(index, 1);
      message = 'Removed from wishlist';
    }

    await user.save();
    await user.populate('wishlist');

    res.json({
      message,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
