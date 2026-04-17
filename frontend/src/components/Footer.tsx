'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import styles from '@/styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>About Byte Bazar Tech</h3>
          <p>
            We&apos;re passionate about providing top-quality gaming peripherals that enhance
            your gaming experience. From mechanical keyboards to high-performance gaming
            mice, we ensure the best quality and innovation.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="Discord"><FaDiscord /></a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/products?category=keyboards">Keyboards</Link></li>
            <li><Link href="/products?category=mice">Mice</Link></li>
            <li><Link href="/products?category=headsets">Headsets</Link></li>
            <li><Link href="/products?category=mousepads">Mouse Pads</Link></li>
            <li><Link href="/products?category=monitors">Monitors</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Customer Service</h3>
          <ul>
            <li><Link href="/customer-service">Shipping Info</Link></li>
            <li><Link href="/customer-service">Returns &amp; Exchanges</Link></li>
            <li><Link href="/customer-service">Warranty</Link></li>
            <li><Link href="/customer-service">Size Guide</Link></li>
            <li><Link href="/customer-service">FAQ</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Contact Info</h3>
          <div className={styles.contactInfo}>
            <p><FiMail /> support@bytebazartech.com</p>
            <p><FiPhone /> +977 123-456-7890</p>
            <p><FiMapPin /> IIMS College, Kathmandu, Nepal</p>
            <p><FiClock /> Mon-Fri: 9AM-6PM</p>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Byte Bazar Tech. All rights reserved. | Privacy Policy | Terms of Service</p>
      </div>
    </footer>
  );
};

export default Footer;
