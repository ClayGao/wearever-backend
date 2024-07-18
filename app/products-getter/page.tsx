import { ProductListContainer } from '@/src/containers/ProductListContainer';
import React from 'react';
import type { Product } from '@/types';


async function getData(): Promise<Product[]> {
  const result = await fetch('https://wearever-backend.vercel.app/api/get-store-products', {
    cache: 'no-store', 
  })
  if(!result.ok) {
    throw new Error('Failed to fetch data')
  }
  return result.json()
}

const ProductsGetter: React.FC = async () => {
  const products = await getData()
  const simplyProducts = products.map((product) => {
    return {
      ...product,
      _id: product._id.toString()
    }
  }).reverse()
  return (    
    <ProductListContainer products={simplyProducts} />
  );
}

export default ProductsGetter;