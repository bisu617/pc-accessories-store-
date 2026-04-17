import { Request, Response } from 'express';
import Product from '../models/Product.js';

// GET /api/products
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, sort, search } = req.query;

    // Build filter
    const filter: any = {};
    if (category && category !== 'all') {
      const catStr = category.toString().toLowerCase();
      const singular = catStr.endsWith('s') ? catStr.slice(0, -1) : catStr;
      const plural = catStr.endsWith('s') ? catStr : catStr + 's';
      const variants = [catStr, singular, plural];
      
      // Special cases
      if (catStr === 'mice' || catStr === 'mouse') variants.push('mice', 'mouse');
      if (catStr === 'headsets' || catStr === 'headphone') variants.push('headsets', 'headphone');
      
      filter.category = { $in: variants };
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Build sort
    let sortOption: any = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default: // featured - badges first
        sortOption = { badge: -1, createdAt: -1 };
    }

    const products = await Product.find(filter).sort(sortOption);

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// GET /api/products/:id
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
