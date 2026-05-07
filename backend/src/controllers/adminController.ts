import { Request, Response } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Multer config for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

let revenueCache: { value: number; ts: number } | null = null;
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalProducts, totalUsers, totalOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
    ]);

    // ---- revenue cache (5 s) ----
    const now = Date.now();
    let totalRevenue = 0;
    if (revenueCache && now - revenueCache.ts < 5000) {
      totalRevenue = revenueCache.value;
    } else {
      const agg = await Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]);
      totalRevenue = agg[0]?.total ?? 0;
      revenueCache = { value: totalRevenue, ts: now };
    }

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName email')
      .lean();

    const outOfStock = await Product.countDocuments({ inStock: false });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      outOfStock,
      recentOrders,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const adminGetProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json({ products });
  } catch {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

export const adminCreateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, price, image, badge, features, rating, inStock, description } = req.body;

    if (!name || !category || price == null || !image) {
      res.status(400).json({ message: 'name, category, price and image are required.' });
      return;
    }

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      image,
      badge: badge || '',
      features: Array.isArray(features) ? features : [],
      rating: Number(rating) || 0,
      inStock: inStock !== false,
      description: description || '',
    });

    res.status(201).json({ product });
  } catch (err: any) {
    res.status(400).json({ message: err.message || 'Failed to create product.' });
  }
};

export const adminUpdateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }
    res.json({ product });
  } catch (err: any) {
    res.status(400).json({ message: err.message || 'Failed to update product.' });
  }
};

export const adminDeleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found.' });
      return;
    }
    res.json({ message: 'Product deleted.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const adminGetOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = '1', limit = '20' } = req.query as Record<string, string>;
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'firstName lastName email')
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

export const adminUpdateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status.' });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({ message: 'Order not found.' });
      return;
    }
    res.json({ order });
  } catch {
    res.status(500).json({ message: 'Failed to update order.' });
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const adminGetUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20' } = req.query as Record<string, string>;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(),
    ]);
    res.json({ users, total });
  } catch {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

export const adminUpdateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role.' });
      return;
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Failed to update user role.' });
  }
};

// ─── First-admin setup (only works when no admins exist) ──────────────────────

export const setupFirstAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      res.status(403).json({ message: 'Admin already exists. Use the admin panel to promote users.' });
      return;
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    user.role = 'admin';
    await user.save();
    res.json({ message: `${user.email} is now an admin.` });
  } catch {
    res.status(500).json({ message: 'Setup failed.' });
  }
};

// ─── Image Upload & Convert ──────────────────────────────────────────────────

export const adminUploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded.' });
      return;
    }

    const fileName = `product_${Date.now()}.webp`;
    const outputPath = path.join(process.cwd(), 'public', 'images', fileName);

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Process with sharp
    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile(outputPath);

    res.json({ 
      message: 'Image uploaded and converted successfully',
      url: `/images/${fileName}` 
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to process image.' });
  }
};
