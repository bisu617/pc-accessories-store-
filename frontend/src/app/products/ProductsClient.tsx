'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IProduct } from '@/types';
import { wishlistAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
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

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Keep category/sort in sync with URL (e.g. browser back/forward)
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all');
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
      list = list.filter((p) => p.category === category);
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
