'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiX, FiTruck, FiShield } from 'react-icons/fi';
import { IProduct } from '@/types';
import { getImageUrl } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import styles from '@/styles/ProductDetail.module.css';

interface ProductDetailClientProps {
  product: IProduct;
  relatedProducts: IProduct[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAddToCart = async () => {
    if (!product.inStock) return;
    await addToCart(product);
    setAdded(true);
    showToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.container}
    >
      <button className={styles.backBtn} onClick={() => router.back()}>
        <FiArrowLeft /> Back to Shop
      </button>

      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            {product.badge && (
              <span className={`${styles.badge} ${styles[`badge${product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}`]}`}>
                {product.badge}
              </span>
            )}
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x400?text=Image+Not+Found';
              }}
            />
          </div>
        </div>

        <div className={styles.infoSection}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.rating}>
            <span style={{ color: '#fbbc04', letterSpacing: '2px' }}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span style={{ marginLeft: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              {product.rating} / 5.0 (124 Reviews)
            </span>
          </div>

          <div className={styles.price}>${product.price.toFixed(2)}</div>

          <div className={styles.stock}>
            {product.inStock ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color)' }}>
                <FiCheck /> <span style={{ fontWeight: 600 }}>In Stock — Ready to ship</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error-color)' }}>
                <FiX /> <span style={{ fontWeight: 600 }}>Out of Stock</span>
              </div>
            )}
          </div>

          <div className={styles.deliveryBox}>
            <div className={styles.deliveryItem}>
              <FiTruck size={18} /> <span>Free shipping on orders over $150</span>
            </div>
            <div className={styles.deliveryItem}>
              <FiShield size={18} /> <span>2 Year ByteBazar Warranty</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.addToCartBtn} ${added ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{ flexGrow: 1 }}
            >
              <FiShoppingCart />
              {added ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className={styles.wishlistBtn} style={{ padding: '0 20px', fontSize: '1.2rem' }}>
              <FiHeart />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className={styles.tabsNav}>
            {['overview', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.description}>
                <p>{product.description}</p>
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Key Features</h4>
                  <ul className={styles.featureList}>
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className={styles.specsPlaceholder}>
                <p>Detailed specifications for {product.name} are coming soon.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className={styles.reviewsPlaceholder}>
                <p>No reviews yet for this product. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.related}>
          <h2 className="section-title">Related Products</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
