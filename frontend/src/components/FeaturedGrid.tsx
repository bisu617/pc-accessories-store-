import React from 'react';
import { IProduct } from '@/types';
import ProductCard from './ProductCard';
import styles from '@/styles/Home.module.css';

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // fetch with revalidation
    const res = await fetch(`${backendUrl}/api/products?sort=rating`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data.products?.slice(0, 4) || []; 
  } catch (error) {
    console.error('SERVER FETCH ERROR: Failed to fetch products:', error);
    return [];
  }
}

export default async function FeaturedGrid() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <div className={styles.productsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 350, transform: 'scale(1)' }} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
