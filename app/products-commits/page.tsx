import  CommitListContainer from '@/src/containers/CommitListContainer';
import type { Product } from '@/types';
import React from 'react';
import Link from 'next/link';


async function getData(): Promise<Product[]> {
  const result = await fetch('https://wearever-backend.vercel.app/api/get-commit-products', {
    cache: 'no-store', 
  })
  if(!result.ok) {
    throw new Error('Failed to fetch data')
  }
  return result.json()
}

const ProductsGetter: React.FC = async () => {
  const products = await getData()

  if (!products.length) {
    return <div>Failed to fetch data</div>
  }

  const groupedProducts: { [key: string]: Product[] } = products.reduce((acc, product) => {
    // @ts-ignore
    if(!acc[product.commitedAt]) {
    // @ts-ignore
      acc[product.commitedAt] = []
    }
    // @ts-ignore
    acc[product.commitedAt].push(product)
    return acc
  }, {});
  
  return (    
    <CommitListContainer groupedProducts={groupedProducts} />
  )
}

export default ProductsGetter;