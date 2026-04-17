import React from 'react';
import styles from '@/styles/Products.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className="section-title">Store</h1>
          <div className="skeleton" style={{ width: '150px', height: '20px', marginTop: '12px' }} />
        </div>
        <div className={styles.controls}>
          <div className="skeleton" style={{ width: '180px', height: '44px', borderRadius: '22px' }} />
        </div>
      </div>

      <div className={styles.filters} style={{ overflow: 'hidden' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ width: '110px', height: '42px', borderRadius: '21px', flexShrink: 0 }} />
        ))}
      </div>

      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="skeleton" style={{ aspectRatio: '1 / 1.4', borderRadius: '16px' }} />
        ))}
      </div>
    </div>
  );
}
