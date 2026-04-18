import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedGrid from '@/components/FeaturedGrid';
import styles from '@/styles/Home.module.css';

function FeaturedSkeleton() {
  return (
    <div className={styles.productsGrid}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton" style={{ height: 350, transform: 'scale(1)' }} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <>
      {/* Top Banner exactly like Raycon */}
      <div className={styles.topBanner}>
        <p>20% OFF PREMIUM GAMING GEAR WITH BRAND</p>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          {/* Abstract SVG Squiggles */}
          <svg className={styles.squiggle1} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 90 Q 30 10 50 50 T 90 10" stroke="#ff00ff" strokeWidth="4" strokeLinecap="round" fill="transparent"/>
          </svg>
          <svg className={styles.squiggle2} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 50 C 30 10, 70 90, 90 50" stroke="#00ffff" strokeWidth="4" strokeLinecap="round" fill="transparent"/>
          </svg>
        </div>
        
        <div className={styles.heroContentWrapper}>
          <div className={styles.heroContent}>
            <h1>LEVEL UP YOUR SETUP</h1>
            <p>Our Summer performance sale is on.<br/>Get 20% off all Gaming Gear.</p>
            <Link href="/products" className={styles.heroBtn}>
              SHOP NOW
            </Link>
          </div>
          <div className={styles.heroImage}>
            {/* The user's original setup image floating */}
            <Image
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
              alt="Premium Gaming Setup"
              width={650}
              height={450}
              className={styles.mainHeroImg}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className={styles.bestSellers}>
        <div className="container">
          <h2 className="section-title">OUR BEST SELLERS</h2>
          
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedGrid />
          </Suspense>
        </div>
      </section>
    </>
  );
}
