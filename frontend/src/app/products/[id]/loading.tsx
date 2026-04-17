import React from 'react';
import styles from '@/styles/ProductDetail.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className="skeleton" style={{ width: '150px', height: '32px', marginBottom: '30px' }}></div>
      
      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px' }}></div>
        </div>
        
        <div className={styles.infoSection}>
          <div className="skeleton" style={{ width: '120px', height: '24px', marginBottom: '15px' }}></div>
          <div className="skeleton" style={{ width: '85%', height: '48px', marginBottom: '20px' }}></div>
          
          <div className="skeleton" style={{ width: '160px', height: '28px', marginBottom: '25px' }}></div>
          <div className="skeleton" style={{ width: '100px', height: '36px', marginBottom: '35px' }}></div>
          
          <div className="skeleton" style={{ width: '100%', height: '100px', borderRadius: '12px', marginBottom: '30px' }}></div>
          
          <div className={styles.actions} style={{ gap: '20px' }}>
            <div className="skeleton" style={{ flex: 1, height: '56px', borderRadius: '28px' }}></div>
            <div className="skeleton" style={{ width: '56px', height: '56px', borderRadius: '50%' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '30px', marginTop: '50px', borderBottom: '2px solid #f1f5f9' }}>
            <div className="skeleton" style={{ width: '100px', height: '40px' }}></div>
            <div className="skeleton" style={{ width: '100px', height: '40px' }}></div>
            <div className="skeleton" style={{ width: '100px', height: '40px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
