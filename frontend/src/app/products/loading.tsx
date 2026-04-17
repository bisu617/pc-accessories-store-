import React from 'react';
import styles from '@/styles/Products.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="section-title">Products</h1>
          <div className="skeleton" style={{ width: '120px', height: '24px', marginTop: '10px' }} />
        </div>
        <div className={styles.controls}>
          <div className="skeleton" style={{ width: '150px', height: '40px', borderRadius: '4px' }} />
        </div>
      </div>

      <div className={styles.filters}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton" style={{ width: '100px', height: '40px', borderRadius: '20px' }} />
        ))}
      </div>

      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="skeleton" style={{ height: '350px', borderRadius: '12px' }} />
        ))}
      </div>
    </div>
  );
}
