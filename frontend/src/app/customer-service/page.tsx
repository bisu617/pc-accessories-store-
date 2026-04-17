import React from 'react';
import Link from 'next/link';
import { FiTruck, FiRefreshCcw, FiShield, FiHelpCircle, FiMail } from 'react-icons/fi';
import styles from '@/styles/CustomerService.module.css';

export default function CustomerServicePage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '10px' }}>Customer Service</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
          We're here to help! Find answers to our most common questions below, or reach out to our team directly.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Support Blocks */}
        <div className={styles.card}>
          <div className={styles.iconWrapper}><FiTruck size={32} /></div>
          <h3>Shipping Information</h3>
          <p>We offer fast, reliable shipping worldwide. Free shipping is available for all orders over $50.</p>
          <ul className={styles.list}>
            <li>Standard Shipping: 3-5 business days</li>
            <li>Express Shipping: 1-2 business days</li>
            <li>International: 7-14 business days</li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.iconWrapper}><FiRefreshCcw size={32} /></div>
          <h3>Returns & Exchanges</h3>
          <p>Not 100% satisfied? We accept returns within 30 days of delivery for a full refund or exchange.</p>
          <ul className={styles.list}>
            <li>Items must be in original condition</li>
            <li>Return shipping is covered by us</li>
            <li>Refunds take 3-5 business days to process</li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.iconWrapper}><FiShield size={32} /></div>
          <h3>Warranty Support</h3>
          <p>All Byte Bazar Tech products come with a 1-year manufacturer warranty against defects.</p>
          <ul className={styles.list}>
            <li>Covers internal defects and malfunctions</li>
            <li>Does not cover accidental damage</li>
            <li>Must provide proof of purchase</li>
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.iconWrapper}><FiHelpCircle size={32} /></div>
          <h3>FAQ</h3>
          <div className={styles.faq}>
            <strong>How do I track my order?</strong>
            <p>You can track your order via the <Link href="/orders">Orders</Link> page in your account dashboard.</p>
            <strong>Do you price match?</strong>
            <p>We do not currently offer price matching.</p>
          </div>
        </div>
      </div>

      <div className={styles.contactBanner}>
        <h2>Still need help?</h2>
        <p>Our support team is available Monday-Friday, 9AM-6PM EST.</p>
        <a href="mailto:support@bytebazartech.com" className={styles.contactBtn}>
          <FiMail /> Contact Support
        </a>
      </div>
    </div>
  );
}
