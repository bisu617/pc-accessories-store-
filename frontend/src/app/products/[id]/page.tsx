'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { IProduct } from '@/types';
import { productsAPI, getImageUrl } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProductCard from '@/components/ProductCard';
import styles from '@/styles/ProductDetail.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productsAPI.getById(params.id as string);
        setProduct(res.data.product);

        // Fetch related products
        const relRes = await productsAPI.getAll({ category: res.data.product.category });
        setRelatedProducts(
          relRes.data.products.filter((p: IProduct) => p._id !== res.data.product._id).slice(0, 3)
        );
      } catch (error) {
        showToast('Product not found', 'error');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id, router, showToast]);

  const handleAddToCart = async () => {
    if (!product || !product.inStock) return;
    await addToCart(product);
    setAdded(true);
    showToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <LoadingSpinner size={50} text="Loading product..." />;
  if (!product) return null;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        <FiArrowLeft /> Back
      </button>

      <div className={styles.productLayout}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            {product.badge && (
              <span className={`${styles.badge} ${styles[`badge${product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}`]}`}>
                {product.badge}
              </span>
            )}
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x400?text=Image+Not+Found';
              }}
            />
          </div>
        </div>

        <div className={styles.infoSection}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.rating}>
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
            <span>{product.rating} / 5.0</span>
          </div>

          <div className={styles.price}>${product.price.toFixed(2)}</div>

          <div className={styles.stock}>
            {product.inStock ? (
              <span className={styles.inStock}><FiCheck /> In Stock</span>
            ) : (
              <span className={styles.outOfStock}><FiX /> Out of Stock</span>
            )}
          </div>

          <div className={styles.features}>
            <h3>Features</h3>
            <div className={styles.featureTags}>
              {product.features.map((f, i) => (
                <span key={i} className={styles.featureTag}>{f}</span>
              ))}
            </div>
          </div>

          {product.description && (
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={`${styles.addToCartBtn} ${added ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <FiShoppingCart />
              {added ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className={styles.wishlistBtn}>
              <FiHeart />
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className={styles.related}>
          <h2 className="section-title">Related Products</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
