'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ICartItem, IProduct } from '@/types';
import { cartAPI } from '@/services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: ICartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  addToCart: (product: IProduct, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Calculate totals from items
  const calculateTotals = useCallback((cartItems: ICartItem[]) => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
    const newCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(parseFloat(newTotal.toFixed(2)));
    setItemCount(newCount);
  }, []);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
      setItemCount(res.data.itemCount || 0);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load cart when user logs in
  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      // Load from localStorage for guests
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setItems(parsed);
        calculateTotals(parsed);
      }
    }
  }, [user, token, fetchCart, calculateTotals]);

  // Save guest cart to localStorage
  const saveGuestCart = (cartItems: ICartItem[]) => {
    localStorage.setItem('guestCart', JSON.stringify(cartItems));
    calculateTotals(cartItems);
  };

  const addToCart = async (product: IProduct, quantity: number = 1) => {
    if (token) {
      try {
        const res = await cartAPI.add(product._id, quantity);
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
        setItemCount(res.data.itemCount || 0);
      } catch (error) {
        console.error('Add to cart error:', error);
      }
    } else {
      // Guest cart
      const existing = items.find((item) => item.product._id === product._id);
      let newItems: ICartItem[];
      if (existing) {
        newItems = items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...items, { product, quantity }];
      }
      setItems(newItems);
      saveGuestCart(newItems);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (token) {
      try {
        const res = await cartAPI.remove(productId);
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
        setItemCount(res.data.itemCount || 0);
      } catch (error) {
        console.error('Remove from cart error:', error);
      }
    } else {
      const newItems = items.filter((item) => item.product._id !== productId);
      setItems(newItems);
      saveGuestCart(newItems);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (token) {
      try {
        const res = await cartAPI.update(productId, quantity);
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
        setItemCount(res.data.itemCount || 0);
      } catch (error) {
        console.error('Update quantity error:', error);
      }
    } else {
      const newItems = items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      setItems(newItems);
      saveGuestCart(newItems);
    }
  };

  const clearCart = async () => {
    if (token) {
      try {
        await cartAPI.clear();
      } catch (error) {
        console.error('Clear cart error:', error);
      }
    }
    setItems([]);
    setTotal(0);
    setItemCount(0);
    localStorage.removeItem('guestCart');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
