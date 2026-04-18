import React from 'react';
import styles from '@/styles/Home.module.css';

export default function Loading() {
  return (
    <div style={{ width: '100%' }}>
      {/* Top Banner Skeleton */}
      <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: 0 }} />

      {/* Hero Skeleton */}
      <section className={styles.hero} style={{ height: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%' }}>
          <div>
            <div className="skeleton" style={{ width: '80%', height: '60px', marginBottom: '20px' }} />
            <div className="skeleton" style={{ width: '60%', height: '40px', marginBottom: '30px' }} />
            <div className="skeleton" style={{ width: '180px', height: '54px', borderRadius: '27px' }} />
          </div>
          <div className="skeleton" style={{ width: '100%', height: '400px', borderRadius: '16px' }} />
        </div>
      </section>

      {/* Grid Header Skeleton */}
      <div className="container" style={{ marginTop: '4rem' }}>
        <div className="skeleton" style={{ width: '300px', height: '40px', margin: '0 auto 3rem', display: 'block' }} />
        
        {/* Product Grid Skeleton */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ aspectRatio: '1 / 1.4', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
