'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { IProduct } from '@/types';
import { productsAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { wishlistAPI } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';
import styles from '@/styles/Products.module.css';

const categoryOptions = [
  { value: 'all', label: 'All Products' },
  { value: 'keyboard', label: 'Keyboards' },
  { value: 'mouse', label: 'Mice' },
  { value: 'headphone', label: 'Headsets' },
  { value: 'mousepad', label: 'Mouse Pads' },
  { value: 'monitor', label: 'Monitors' },
  { value: 'accessories', label: 'Accessories' },
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'rating', label: 'Highest Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('featured');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = { sort };
      if (category !== 'all') params.category = category;
      const res = await productsAPI.getAll(params);
      setProducts(res.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [category, sort, showToast]);

  const fetchWishlist = useCallback(async () => {
    if (!token) return;
    try {
      const res = await wishlistAPI.get();
      setWishlist(res.data.wishlist.map((p: any) => p._id || p));
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const handleWishlistToggle = async (productId: string) => {
    if (!token) {
      showToast('Please login to use wishlist', 'warning');
      return;
    }
    try {
      const res = await wishlistAPI.toggle(productId);
      setWishlist(res.data.wishlist.map((p: any) => p._id || p));
      showToast(res.data.message, 'success');
    } catch (error) {
      showToast('Failed to update wishlist', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="section-title">
            {category === 'all' ? 'All Products' : categoryOptions.find(c => c.value === category)?.label || 'Products'}
          </h1>
          <p className="section-subtitle">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className={styles.controls}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={styles.select}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.filters}>
        {categoryOptions.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.filterBtn} ${category === opt.value ? styles.active : ''}`}
            onClick={() => setCategory(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner size={50} text="Loading products..." />
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={wishlist.includes(product._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size={50} text="Loading category..." />}>
      <ProductsContent />
    </Suspense>
  );
}
