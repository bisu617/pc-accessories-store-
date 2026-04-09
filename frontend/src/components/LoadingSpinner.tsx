'use client';

import React from 'react';

const LoadingSpinner: React.FC<{ size?: number; text?: string }> = ({ size = 40, text }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem',
    }}>
      <div
        style={{
          width: size,
          height: size,
          border: '4px solid #e0e0e0',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && <p style={{ color: '#666', fontWeight: 500 }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
