'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiBox, FiShoppingBag, FiUsers, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { adminAPI } from '@/services/api';
import styles from '@/styles/Admin.module.css';

interface Stats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  outOfStock: number;
  recentOrders: any[];
}

const statusClass: Record<string, string> = {
  pending:    styles.badgePending,
  processing: styles.badgeProcessing,
  shipped:    styles.badgeShipped,
  delivered:  styles.badgeDelivered,
  cancelled:  styles.badgeCancelled,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;
  if (!stats)  return <div className={styles.empty}>Failed to load stats.</div>;

  return (
    <>
      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.green}`}><FiDollarSign /></div>
          <div className={styles.statInfo}>
            <h3>${stats.totalRevenue.toFixed(0)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.blue}`}><FiShoppingBag /></div>
          <div className={styles.statInfo}>
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.purple}`}><FiUsers /></div>
          <div className={styles.statInfo}>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.orange}`}><FiBox /></div>
          <div className={styles.statInfo}>
            <h3>{stats.totalProducts}</h3>
            <p>Products</p>
          </div>
        </div>
        {stats.outOfStock > 0 && (
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.red}`}><FiAlertCircle /></div>
            <div className={styles.statInfo}>
              <h3>{stats.outOfStock}</h3>
              <p>Out of Stock</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link href="/admin/products" className={styles.btnPrimary}>Manage Products</Link>
        <Link href="/admin/orders"   className={styles.btnSecondary}>View Orders</Link>
        <Link href="/admin/users"    className={styles.btnSecondary}>Manage Users</Link>
      </div>

      {/* Recent Orders */}
      <div className={styles.tableCard}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
          <p className={styles.sectionTitle}>Recent Orders</p>
        </div>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>No orders yet.</td></tr>
              ) : stats.recentOrders.map((order: any) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>{order.user?.firstName} {order.user?.lastName}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`${styles.badge} ${statusClass[order.status] || ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
