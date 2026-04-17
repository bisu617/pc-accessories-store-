'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default ClientProviders;
