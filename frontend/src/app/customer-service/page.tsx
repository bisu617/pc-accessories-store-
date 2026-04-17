import React from 'react';

export default function CustomerServicePage() {
  return (
    <div className="container" style={{ padding: '100px 20px', minHeight: '60vh' }}>
      <h1 className="section-title">Customer Service</h1>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginTop: '20px' }}>
        <p style={{ marginBottom: '20px' }}>
          Welcome to our Customer Service center. We are here to help you coordinate shipping, returns, and track your orders. 
        </p>
        <p>
          For immediate assistance, please contact us at <strong>support@bytebazartech.com</strong>.
        </p>
      </div>
    </div>
  );
}
