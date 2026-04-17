'use client';

import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { adminAPI, getImageUrl } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { IProduct } from '@/types';
import styles from '@/styles/Admin.module.css';

const CATEGORIES = ['keyboard', 'mouse', 'headphone', 'mousepad', 'monitor'];
const BADGES = ['', 'hot', 'new', 'sale'];

const emptyForm = {
  name: '', category: 'keyboard', price: '', image: '',
  badge: '', features: '', rating: '0', inStock: true, description: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<IProduct | null>(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState('');

  const load = () => {
    setLoading(true);
    adminAPI.getProducts()
      .then((res) => setProducts(res.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: IProduct) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      image: p.image,
      badge: p.badge || '',
      features: p.features.join(', '),
      rating: String(p.rating),
      inStock: p.inStock,
      description: p.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await adminAPI.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating),
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        const res = await adminAPI.updateProduct(editing._id, payload);
        setProducts((prev) => prev.map((p) => p._id === editing._id ? res.data.product : p));
      } else {
        const res = await adminAPI.createProduct(payload);
        setProducts((prev) => [res.data.product, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={styles.pageHeader}>
        <h1>Products</h1>
        <button className={styles.btnPrimary} onClick={openAdd}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className={styles.filterBar}>
        <input
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 240 }}
        />
        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{filtered.length} products</span>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          {loading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Badge</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af' }}>No products found.</td>
                    </motion.tr>
                  ) : filtered.map((p) => (
                    <motion.tr 
                      key={p._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td>
                        <Image 
                          src={getImageUrl(p.image) || 'https://via.placeholder.com/60'} 
                          alt={p.name} 
                          width={60} 
                          height={60} 
                          className={styles.productThumb} 
                          style={{ objectFit: 'contain' }}
                        />
                      </td>
                      <td style={{ maxWidth: 200, fontWeight: 500 }}>{p.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>
                        {p.badge ? (
                          <span className={`${styles.badge} ${styles.badgeProcessing}`}>{p.badge}</span>
                        ) : '—'}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${p.inStock ? styles.badgeInStock : styles.badgeOutOfStock}`}>
                          {p.inStock ? 'In Stock' : 'Out'}
                        </span>
                      </td>
                      <td>{p.rating} ★</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.btnSecondary} onClick={() => openEdit(p)}>
                            <FiEdit2 size={13} /> Edit
                          </button>
                          <button className={styles.btnDanger} onClick={() => handleDelete(p._id, p.name)}>
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button className={styles.modalClose} onClick={() => setModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Price ($) *</label>
                    <input required type="number" min="0" step="0.01" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Image path or URL *</label>
                    <input required placeholder="/images/keyboard.jpg or https://..." value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })} />
                    {form.image && (
                      <img src={getImageUrl(form.image)} alt="preview"
                        style={{ width: 60, height: 60, objectFit: 'contain', marginTop: 6, borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label>Badge</label>
                    <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                      {BADGES.map((b) => <option key={b} value={b}>{b || 'None'}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Rating (0–5)</label>
                    <input type="number" min="0" max="5" step="0.1" value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Features (comma-separated)</label>
                    <input placeholder="RGB, Wireless, USB-C" value={form.features}
                      onChange={(e) => setForm({ ...form, features: e.target.value })} />
                  </div>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label>Description</label>
                    <textarea value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>In Stock</label>
                    <select value={form.inStock ? 'true' : 'false'}
                      onChange={(e) => setForm({ ...form, inStock: e.target.value === 'true' })}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
