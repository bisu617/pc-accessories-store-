import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import { IProduct } from '@/types';

// BACKEND_URL is a server-only env var for internal calls; falls back to public API URL
const BACKEND = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAllProducts(): Promise<IProduct[]> {
  try {
    const res = await fetch(`${BACKEND}/api/products`, {
      next: { revalidate: 60 }, // cache and revalidate every 60 seconds
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [products, params] = await Promise.all([
    fetchAllProducts(),
    searchParams,
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialCategory={params.category || 'all'}
      initialSort={params.sort || 'featured'}
    />
  );
}
