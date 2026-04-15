'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { adminAPI } from '@/services/api';
import styles from '@/styles/Admin.module.css';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers]     = useState<any[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    adminAPI.getUsers({ page })
      .then((res) => {
        setUsers(res.data.users);
        setTotal(res.data.total);
        setPages(Math.ceil(res.data.total / 20));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action  = newRole === 'admin' ? 'promote to admin' : 'revoke admin from';
    const target  = users.find((u) => u._id === userId);
    if (!confirm(`${action} ${target?.firstName} ${target?.lastName}?`)) return;

    setUpdating(userId);
    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => u._id === userId ? res.data.user : u));
    } catch {
      alert('Failed to update role.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Users <span style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 400 }}>({total} total)</span></h1>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.loading}>Loading users...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#9ca3af' }}>No users found.</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                    <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{u.email}</td>
                    <td>
                      <span className={`${styles.badge} ${u.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u._id === currentUser?._id ? (
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>You</span>
                      ) : (
                        <button
                          className={u.role === 'admin' ? styles.btnDanger : styles.btnSecondary}
                          disabled={updating === u._id}
                          onClick={() => toggleRole(u._id, u.role)}
                        >
                          {updating === u._id
                            ? 'Updating...'
                            : u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
