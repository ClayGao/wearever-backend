import { ProductListContainer } from '@/src/containers/ProductListContainer';
import React from 'react';

type ProductType = {
  _id: string
  name: string
  price: number
  image: string
  description: string
  createdAt: string
}

async function getData(): Promise<ProductType[]> {
  const result = await fetch('https://wearever-backend.vercel.app/api/get-store-products', {
    next: {
      revalidate: 600
    }
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
  })
  return (    
    <ProductListContainer products={simplyProducts} />
  );
}

export default ProductsGetter;