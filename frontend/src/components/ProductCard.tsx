'use client';

import React from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiHeart, FiBell } from 'react-icons/fi';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { getImageUrl } from '@/services/api';
import styles from '@/styles/ProductCard.module.css';

interface ProductCardProps {
  product: IProduct;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onWishlistToggle, isWishlisted }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    await addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(product._id);
  };

  return (
    <Link href={`/products/${product._id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
          }}
        />
        {product.badge && (
          <span className={`${styles.badge} ${styles[`badge${product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}`]}`}>
            {product.badge}
          </span>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.features}>
          {product.features.map((feature, i) => (
            <span key={i} className={styles.featureTag}>{feature}</span>
          ))}
        </div>

        <div className={styles.rating}>
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
          <span className={styles.ratingNum}>{product.rating}</span>
        </div>

        <div className={styles.price}>${product.price.toFixed(2)}</div>

        <div className={styles.actions}>
          <button
            className={`${styles.addToCart} ${!product.inStock ? styles.disabled : ''} ${added ? styles.added : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {added ? (
              <><FiShoppingCart /> Added!</>
            ) : product.inStock ? (
              <><FiShoppingCart /> Add to Cart</>
            ) : (
              <><FiBell /> Notify Me</>
            )}
          </button>

          {onWishlistToggle && (
            <button
              className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
              onClick={handleWishlist}
            >
              <FiHeart />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
