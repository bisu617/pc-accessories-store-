import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IProduct } from '@/types';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res = await fetch(`${backendUrl}/api/products/${id}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product;
}

async function getRelatedProducts(category: string) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const res = await fetch(`${backendUrl}/api/products?category=${category}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.products || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Byte Bazar Tech`,
    description: product.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const allRelated = await getRelatedProducts(product.category);
  const related = allRelated.filter((p: IProduct) => p._id !== id).slice(0, 3);

  return <ProductDetailClient product={product} relatedProducts={related} />;
}

