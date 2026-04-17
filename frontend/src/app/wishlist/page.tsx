'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { wishlistAPI } from '@/services/api';
import { IProduct } from '@/types';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/Toast';
import styles from '@/styles/Wishlist.module.css';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistAPI.get();
      setProducts(res.data.wishlist);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (user) fetchWishlist();
  }, [user, authLoading, router]);

  const handleToggle = async (productId: string) => {
    try {
      const res = await wishlistAPI.toggle(productId);
      setProducts(res.data.wishlist);
      showToast(res.data.message, 'success');
    } catch (error) {
      showToast('Failed to update wishlist', 'error');
    }
  };

  if (loading || authLoading) return <LoadingSpinner text="Loading wishlist..." />;

  return (
    <div className={styles.container}>
      <h1 className="section-title">My Wishlist</h1>
      <p className={styles.subtitle}>{products.length} item{products.length !== 1 ? 's' : ''} saved</p>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <FiHeart size={64} />
          <h2>Your wishlist is empty</h2>
          <p>Browse products and save your favorites here.</p>
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
