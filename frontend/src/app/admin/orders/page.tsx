'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '@/services/api';
import styles from '@/styles/Admin.module.css';

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusClass: Record<string, string> = {
  pending:    styles.badgePending,
  processing: styles.badgeProcessing,
  shipped:    styles.badgeShipped,
  delivered:  styles.badgeDelivered,
  cancelled:  styles.badgeCancelled,
};

export default function AdminOrdersPage() {
  const [orders, setOrders]       = useState<any[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatus] = useState('all');
  const [page, setPage]           = useState(1);
  const [pages, setPages]         = useState(1);
  const [updating, setUpdating]   = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getOrders({ status: statusFilter, page })
      .then((res) => {
        setOrders(res.data.orders);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const res = await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o._id === orderId ? res.data.order : o));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Orders <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 400 }}>({total} total)</span></h1>
      </div>

      <div className={styles.filterBar}>
        <select value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
        </select>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.loading}>Loading orders...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af' }}>No orders found.</td></tr>
                ) : orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{order.user?.email}</td>
                    <td>{order.items?.length ?? 0}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <span className={`${styles.badge} ${statusClass[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {STATUSES.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
          <button className={styles.btnSecondary} disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
            Page {page} of {pages}
          </span>
          <button className={styles.btnSecondary} disabled={page === pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
}
