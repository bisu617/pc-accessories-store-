'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/types';
import { getImageUrl } from '@/services/api';
import styles from '@/styles/ProductCard.module.css';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imgSrc, setImgSrc] = React.useState(getImageUrl(product.image));
  
  // Simulated Sale logic like on Raycon (red tag top left)
  const isSale = product.badge?.toLowerCase() === 'sale' || product.price < 50; 
  
  return (
    <div className={styles.cardWrapper}>
      <Link href={`/products/${product._id}`} className={styles.cardImageLink}>
        <div className={styles.imageContainer}>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className={styles.productImg}
            onError={() => setImgSrc('https://via.placeholder.com/600x600?text=No+Image')}
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          {isSale && (
            <span className={styles.saleBadge}>SALE</span>
          )}
        </div>
      </Link>

      <div className={styles.cardInfo}>
        <Link href={`/products/${product._id}`} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        
        {/* Rating Mockup */}
        <div className={styles.ratingBox}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.ratingCount}>({product.rating || 120})</span>
        </div>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          {isSale && (
            <span className={styles.originalPrice}>${(product.price + 20).toFixed(2)}</span>
          )}
        </div>
        
        <Link href={`/products/${product._id}`} className={styles.buyNowBtn}>
          BUY NOW
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
