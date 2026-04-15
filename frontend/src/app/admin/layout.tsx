'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiHome, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import styles from '@/styles/Admin.module.css';

const navItems = [
  { href: '/admin',          label: 'Dashboard', icon: <FiGrid /> },
  { href: '/admin/products', label: 'Products',  icon: <FiBox /> },
  { href: '/admin/orders',   label: 'Orders',    icon: <FiShoppingBag /> },
  { href: '/admin/users',    label: 'Users',     icon: <FiUsers /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <h2>Byte Bazar Tech</h2>
          <span>Admin Panel</span>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          Signed in as {user.firstName}
        </div>
      </aside>

      {/* Main */}
      <div className={styles.mainContent}>
        <header className={styles.topbar}>
          <h1 className={styles.topbarTitle}>
            {navItems.find((n) => n.href === pathname)?.label ?? 'Admin'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/" className={styles.backLink}>
              <FiHome size={14} /> Back to Store
            </Link>
          </div>
        </header>

        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
