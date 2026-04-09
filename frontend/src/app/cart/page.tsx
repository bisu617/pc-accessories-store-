'use client';

import React from 'react';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getImageUrl } from '@/services/api';
import styles from '@/styles/Cart.module.css';

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <FiShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Start adding some awesome products!</p>
        <Link href="/products" className={styles.shopBtn}>
          <FiArrowLeft /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className="section-title">Shopping Cart</h1>
      <p className={styles.subtitle}>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>

      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <div key={item.product._id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img
                  src={getImageUrl(item.product.image)}
                  alt={item.product.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100'; }}
                />
              </div>
              <div className={styles.itemInfo}>
                <Link href={`/products/${item.product._id}`} className={styles.itemName}>
                  {item.product.name}
                </Link>
                <span className={styles.itemCategory}>{item.product.category}</span>
                <span className={styles.itemPrice}>${item.product.price.toFixed(2)}</span>
              </div>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className={styles.qtyBtn}
                >
                  <FiMinus />
                </button>
                <span className={styles.qty}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className={styles.qtyBtn}
                >
                  <FiPlus />
                </button>
              </div>
              <div className={styles.itemTotal}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className={styles.removeBtn}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}

          <button onClick={clearCart} className={styles.clearBtn}>
            <FiTrash2 /> Clear Cart
          </button>
        </div>

        <div className={styles.summary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal ({itemCount} items)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {user ? (
            <Link href="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>
          ) : (
            <Link href="/login" className={styles.checkoutBtn}>
              Login to Checkout
            </Link>
          )}
          <Link href="/products" className={styles.continueBtn}>
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
