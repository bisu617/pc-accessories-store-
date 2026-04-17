'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiX, FiTruck, FiShield } from 'react-icons/fi';
import { IProduct } from '@/types';
import { productsAPI, getImageUrl } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
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
  const [activeTab, setActiveTab] = useState('overview');

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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="skeleton" style={{ width: '100px', height: '40px', marginBottom: '20px' }}></div>
        <div className={styles.productLayout}>
          <div className={styles.imageSection}>
            <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '12px' }}></div>
          </div>
          <div className={styles.infoSection}>
            <div className="skeleton" style={{ width: '120px', height: '24px', marginBottom: '10px' }}></div>
            <div className="skeleton" style={{ width: '80%', height: '40px', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ width: '150px', height: '24px', marginBottom: '20px' }}></div>
            <div className="skeleton" style={{ width: '120px', height: '32px', marginBottom: '30px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '200px', marginBottom: '30px', borderRadius: '8px' }}></div>
            <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '25px' }}></div>
          </div>
        </div>
      </div>
    );
  }

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
            <span style={{ color: '#fbbc04', letterSpacing: '2px' }}>
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span style={{ marginLeft: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              {product.rating} / 5.0 (124 Reviews)
            </span>
          </div>

          <div className={styles.price}>${product.price.toFixed(2)}</div>

          <div className={styles.stock}>
            {product.inStock ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color)' }}>
                <FiCheck /> <span style={{ fontWeight: 600 }}>In Stock — Ready to ship</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error-color)' }}>
                <FiX /> <span style={{ fontWeight: 600 }}>Out of Stock</span>
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div style={{ padding: '15px', background: 'var(--bg-light)', borderRadius: '8px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
              <FiTruck size={18} /> <span>Free shipping on orders over $50</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
              <FiShield size={18} /> <span>1 Year Original Manufacturer Warranty</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.addToCartBtn} ${added ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              style={{ flexGrow: 1 }}
            >
              <FiShoppingCart />
              {added ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className={styles.wishlistBtn} style={{ padding: '0 20px', fontSize: '1.2rem' }}>
              <FiHeart />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div style={{ marginTop: '40px', borderBottom: '2px solid var(--border-color)', display: 'flex', gap: '20px' }}>
            {['overview', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '10px 0',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab ? 800 : 500,
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-light)',
                  borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  marginBottom: '-2px'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div style={{ marginTop: '20px', minHeight: '150px' }}>
            {activeTab === 'overview' && (
              <div className={styles.description}>
                <p style={{ lineHeight: 1.6, color: 'var(--text-dark)' }}>{product.description}</p>
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ marginBottom: '10px' }}>Key Features</h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--text-dark)' }}>
                    {product.features.map((f, i) => (
                      <li key={i} style={{ marginBottom: '5px' }}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div>
                <p style={{ color: 'var(--text-light)' }}>Detailed specifications are not available for this product yet.</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <p style={{ color: 'var(--text-light)' }}>User reviews loading...</p>
              </div>
            )}
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

