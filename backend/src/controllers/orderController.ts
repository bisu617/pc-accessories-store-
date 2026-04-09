import { Response } from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { AuthRequest } from '../types/index.js';

// POST /api/orders
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shippingAddress } = req.body;

    const user = await User.findById(req.user?.id).populate('cart.product');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.cart.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    // Build order items from cart
    const items = user.cart.map((item: any) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: user._id,
      items,
      total: parseFloat(total.toFixed(2)),
      shippingAddress,
      status: 'pending',
    });

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders
export const getOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?.id })
      .sort({ createdAt: -1 })
      .populate('items.product');

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders/:id
export const getOrderById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user?.id,
    }).populate('items.product');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
