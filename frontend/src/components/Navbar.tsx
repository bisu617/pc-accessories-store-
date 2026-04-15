'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiBox, FiShoppingCart, FiUser, FiHeart, FiLogOut, FiMenu, FiX, FiPackage } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import styles from '@/styles/Navbar.module.css';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContent}>
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`${styles.navLeft} ${mobileOpen ? styles.mobileOpen : ''}`}>
          <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
            <FiHome /> Home
          </Link>
          <Link href="/products" className={`${styles.navLink} ${pathname === '/products' ? styles.active : ''}`}>
            <FiBox /> Products
          </Link>
          <Link href="/products?category=all" className={styles.navLink}>
            <FiGrid /> Categories
          </Link>
        </div>

        <Link href="/" className={styles.logo}>
          Byte Bazar Tech
        </Link>

        <div className={`${styles.navRight} ${mobileOpen ? styles.mobileOpen : ''}`}>
          {user ? (
            <div className={styles.userSection}>
              <button
                className={styles.userBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <FiUser />
                <span className={styles.userName}>{user.firstName}</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <FiUser size={20} />
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                  <Link href="/profile" className={styles.dropdownItem}>
                    <FiUser /> Profile
                  </Link>
                  <Link href="/orders" className={styles.dropdownItem}>
                    <FiPackage /> Orders
                  </Link>
                  <Link href="/wishlist" className={styles.dropdownItem}>
                    <FiHeart /> Wishlist
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className={styles.dropdownItem}>
                      <FiPackage /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginLink}>
              <FiUser /> Login
            </Link>
          )}

          <Link href="/cart" className={styles.cartBtn}>
            <FiShoppingCart size={20} />
            {itemCount > 0 && (
              <span className={styles.cartBadge}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
