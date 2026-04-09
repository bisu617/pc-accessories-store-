'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiMonitor, FiHeadphones, FiMousePointer, FiSquare, FiTool } from 'react-icons/fi';
import { LuKeyboard } from 'react-icons/lu';
import { FaRocket, FaThLarge } from 'react-icons/fa';
import { IProduct } from '@/types';
import { productsAPI, getImageUrl } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import styles from '@/styles/Home.module.css';

const categories = [
  { id: 'keyboard', name: 'Mechanical Keyboards', icon: <LuKeyboard />, desc: 'Premium switches for every typing style and gaming preference.' },
  { id: 'mouse', name: 'Gaming Mice', icon: <FiMousePointer />, desc: 'Precision-engineered with high DPI sensors and customizable buttons.' },
  { id: 'headphone', name: 'Gaming Headsets', icon: <FiHeadphones />, desc: 'Immersive audio with crystal-clear communication.' },
  { id: 'mousepad', name: 'Mouse Pads', icon: <FiSquare />, desc: 'Optimized surfaces for peak performance.' },
  { id: 'monitor', name: 'Gaming Monitors', icon: <FiMonitor />, desc: 'High refresh rates and low input lag displays.' },
  { id: 'accessories', name: 'Accessories', icon: <FiTool />, desc: 'Complete your setup with essential accessories.' },
];

const stats = [
  { number: '500+', label: 'Premium Products' },
  { number: '10K+', label: 'Happy Gamers' },
  { number: '24/7', label: 'Customer Support' },
  { number: '99%', label: 'Satisfaction Rate' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsAPI.getAll({ sort: 'rating' });
        setFeaturedProducts(res.data.products.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1>Elevate Your Gaming Experience</h1>
          <p>Discover premium gaming peripherals designed for champions. From mechanical keyboards to high-performance mice.</p>
          <div className={styles.ctaGroup}>
            <Link href="/products" className={styles.ctaPrimary}>
              <FaRocket /> Products
            </Link>
            <Link href="/products?category=all" className={styles.ctaSecondary}>
              <FaThLarge /> Browse Categories
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&crop=center"
            alt="Gaming Setup"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statItem}>
            <span className={styles.statNumber}>{stat.number}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Explore our curated collection of premium gaming peripherals</p>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((cat) => (
            <Link href={`/products?category=${cat.id}`} key={cat.id} className={styles.categoryCard}>
              <div className={styles.categoryIcon}>{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
              <span className={styles.categoryBtn}>
                Explore <FiArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Handpicked premium gaming gear from top brands</p>
        </div>
        {loading ? (
          <div className={styles.productsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 400, borderRadius: 24 }} />
            ))}
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className={styles.viewAll}>
          <Link href="/products" className={styles.viewAllBtn}>
            View All Products <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className={styles.newsletter}>
        <h2>Stay Updated</h2>
        <p>Get exclusive deals, new product launches, and gaming tips delivered to your inbox</p>
        <form className={styles.newsletterForm} onSubmit={(e) => { e.preventDefault(); }}>
          <input type="email" placeholder="Enter your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </>
  );
}
