'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiCalendar, FiPackage, FiHeart, FiLogOut, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Profile.module.css';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  if (!loading && !user) { router.push('/login'); return null; }
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <h1>{user.firstName} {user.lastName}</h1>
        <p className={styles.email}><FiMail /> {user.email}</p>
        <p className={styles.joined}><FiCalendar /> Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className={styles.grid}>
        <Link href="/orders" className={styles.card}>
          <FiPackage size={28} />
          <h3>My Orders</h3>
          <p>View your order history and track deliveries</p>
        </Link>
        <Link href="/wishlist" className={styles.card}>
          <FiHeart size={28} />
          <h3>Wishlist</h3>
          <p>Items you&apos;ve saved for later</p>
        </Link>
        <Link href="/products" className={styles.card}>
          <FiShoppingBag size={28} />
          <h3>Shop</h3>
          <p>Browse our latest products</p>
        </Link>
        <button onClick={handleLogout} className={`${styles.card} ${styles.logoutCard}`}>
          <FiLogOut size={28} />
          <h3>Logout</h3>
          <p>Sign out of your account</p>
        </button>
      </div>
    </div>
  );
}
