'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiCheck } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI, getImageUrl } from '@/services/api';
import { useToast } from '@/components/Toast';
import styles from '@/styles/Checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: '', country: '',
  });

  React.useEffect(() => {
    if (!user) { router.push('/login'); }
    else if (items.length === 0 && !orderPlaced) { router.push('/cart'); }
  }, [user, items.length, orderPlaced, router]);

  if (!user || (items.length === 0 && !orderPlaced)) { return null; }

  if (orderPlaced) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}><FiCheck size={48} /></div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. You can track your order from your profile.</p>
        <button onClick={() => router.push('/orders')} className={styles.viewOrdersBtn}>View Orders</button>
        <button onClick={() => router.push('/products')} className={styles.continueBtn}>Continue Shopping</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ordersAPI.create(address);
      await clearCart();
      setOrderPlaced(true);
      showToast('Order placed successfully!', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="section-title">Checkout</h1>
      <div className={styles.layout}>
        <form className={styles.addressForm} onSubmit={handleSubmit}>
          <h3><FiMapPin /> Shipping Address</h3>
          <div className={styles.formGroup}>
            <label>Street Address</label>
            <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required placeholder="123 Main St" />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>City</label>
              <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required placeholder="Kathmandu" />
            </div>
            <div className={styles.formGroup}>
              <label>State</label>
              <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required placeholder="Bagmati" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>ZIP Code</label>
              <input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} required placeholder="44600" />
            </div>
            <div className={styles.formGroup}>
              <label>Country</label>
              <input type="text" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
            </div>
          </div>
          <h3 style={{ marginTop: '30px' }}><FiCheck /> Payment Details</h3>
          <div className={styles.formGroup}>
            <label>Cardholder Name</label>
            <input type="text" placeholder="John Doe" required />
          </div>
          <div className={styles.formGroup}>
            <label>Card Number</label>
            <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Expiry Date</label>
              <input type="text" placeholder="MM/YY" required />
            </div>
            <div className={styles.formGroup}>
              <label>CVV</label>
              <input type="text" placeholder="123" required />
            </div>
          </div>

          <button type="submit" className={styles.placeOrderBtn} disabled={loading}>
            {loading ? 'Processing Payment...' : 'Pay & Place Order'}
          </button>
        </form>

        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.product._id} className={styles.summaryItem}>
              <img src={getImageUrl(item.product.image)} alt={item.product.name} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50'; }} />
              <div>
                <p className={styles.summaryName}>{item.product.name}</p>
                <p className={styles.summaryQty}>Qty: {item.quantity}</p>
              </div>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
