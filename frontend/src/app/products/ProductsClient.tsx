'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IProduct } from '@/types';
import { wishlistAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
import styles from '@/styles/Products.module.css';

const categoryOptions = [
  { value: 'all', label: 'All Products' },
  { value: 'keyboards', label: 'Keyboards' },
  { value: 'mice', label: 'Mice' },
  { value: 'headsets', label: 'Headsets' },
  { value: 'mousepads', label: 'Mouse Pads' },
  { value: 'monitors', label: 'Monitors' },
];

const normalizeCategory = (cat: string | null) => {
  if (!cat || cat === 'all') return 'all';
  const mapping: Record<string, string> = {
    'keyboard': 'keyboards',
    'mouse': 'mice',
    'headphone': 'headsets',
    'headsets': 'headsets',
    'mousepad': 'mousepads',
    'monitor': 'monitors',
  };
  return mapping[cat.toLowerCase()] || cat.toLowerCase();
};

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'rating', label: 'Highest Rated' },
];

interface Props {
  initialProducts: IProduct[];
  initialCategory: string;
  initialSort: string;
}

export default function ProductsClient({ initialProducts, initialCategory, initialSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [category, setCategory] = useState(normalizeCategory(initialCategory));
  const [sort, setSort] = useState(initialSort);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Keep category/sort in sync with URL (e.g. browser back/forward)
  useEffect(() => {
    setCategory(normalizeCategory(searchParams.get('category')));
    setSort(searchParams.get('sort') || 'featured');
  }, [searchParams]);

  // Fetch wishlist client-side (needs auth token from localStorage)
  useEffect(() => {
    if (!token) return;
    wishlistAPI.get()
      .then((res) => setWishlist(res.data.wishlist.map((p: any) => p._id || p)))
      .catch(() => {});
  }, [token]);

  const handleCategoryChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === 'all') params.delete('category'); else params.set('category', val);
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === 'featured') params.delete('sort'); else params.set('sort', val);
    router.push(`/products?${params.toString()}`);
  };

  const handleWishlistToggle = useCallback(async (productId: string) => {
    if (!token) {
      showToast('Please login to use wishlist', 'warning');
      return;
    }
    try {
      const res = await wishlistAPI.toggle(productId);
      setWishlist(res.data.wishlist.map((p: any) => p._id || p));
      showToast(res.data.message, 'success');
    } catch {
      showToast('Failed to update wishlist', 'error');
    }
  }, [token, showToast]);

  // Filter + sort entirely in JS — no extra API calls
  const products = useMemo(() => {
    let list = [...initialProducts];

    if (category !== 'all') {
      const singular = category.endsWith('s') ? category.slice(0, -1) : category;
      const plural = category.endsWith('s') ? category : category + 's';
      // Handle special cases like 'mice' / 'mouse'
      const variants = [category, singular, plural];
      if (category === 'mice' || category === 'mouse') variants.push('mice', 'mouse');
      if (category === 'headsets' || category === 'headphone') variants.push('headsets', 'headphone');
      
      list = list.filter((p) => variants.includes(p.category.toLowerCase()));
    }

    switch (sort) {
      case 'price-low':  list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      default: // featured — badges first
        list.sort((a, b) => {
          if (a.badge && !b.badge) return -1;
          if (!a.badge && b.badge) return 1;
          return 0;
        });
    }

    return list;
  }, [initialProducts, category, sort]);

  const categoryLabel = categoryOptions.find((c) => c.value === category)?.label || 'Products';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="section-title">{category === 'all' ? 'All Products' : categoryLabel}</h1>
          <p className="section-subtitle">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className={styles.controls}>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
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
            onClick={() => handleCategoryChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
                key={product._id}
              >
                <ProductCard
                  product={product}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
