import { Response } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { AuthRequest } from '../types/index.js';

// GET /api/cart
export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate('cart.product');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const total = user.cart.reduce((sum, item: any) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.json({
      items: user.cart,
      total: parseFloat(total.toFixed(2)),
      itemCount: user.cart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/cart
export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    if (!product.inStock) {
      res.status(400).json({ message: 'Product out of stock' });
      return;
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if product already in cart
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');

    const total = user.cart.reduce((sum, item: any) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.json({
      message: `${product.name} added to cart`,
      items: user.cart,
      total: parseFloat(total.toFixed(2)),
      itemCount: user.cart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/cart/:productId
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      res.status(404).json({ message: 'Item not in cart' });
      return;
    }

    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product');

    const total = user.cart.reduce((sum, item: any) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.json({
      message: 'Cart updated',
      items: user.cart,
      total: parseFloat(total.toFixed(2)),
      itemCount: user.cart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/cart/:productId
export const removeFromCart = async (
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

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    await user.populate('cart.product');

    const total = user.cart.reduce((sum, item: any) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    res.json({
      message: 'Item removed from cart',
      items: user.cart,
      total: parseFloat(total.toFixed(2)),
      itemCount: user.cart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/cart
export const clearCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.cart = [];
    await user.save();

    res.json({
      message: 'Cart cleared',
      items: [],
      total: 0,
      itemCount: 0,
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
