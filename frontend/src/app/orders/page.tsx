'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPackage, FiClock } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { ordersAPI, getImageUrl } from '@/services/api';
import { IOrder } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from '@/styles/Orders.module.css';

const statusColors: Record<string, string> = {
  pending: '#ffa726',
  processing: '#667eea',
  shipped: '#42a5f5',
  delivered: '#2ed573',
  cancelled: '#ff4757',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getAll();
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user, authLoading, router]);

  if (loading || authLoading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div className={styles.container}>
      <h1 className="section-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className={styles.empty}>
          <FiPackage size={64} />
          <h2>No orders yet</h2>
          <p>Your order history will appear here after your first purchase.</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className={styles.orderDate}>
                    <FiClock /> {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <span className={styles.status} style={{ background: statusColors[order.status] || '#666' }}>
                  {order.status}
                </span>
              </div>
              <div className={styles.orderItems}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.orderItem}>
                    <img src={getImageUrl(item.image)} alt={item.name} onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'; }} />
                    <span className={styles.orderItemName}>{item.name}</span>
                    <span className={styles.orderItemQty}>×{item.quantity}</span>
                    <span className={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <span>Total: <strong>${order.total.toFixed(2)}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
