import { ProductListContainer } from '@/src/containers/ProductListContainer';
import React from 'react';
import { downloadJson } from '@/utils/download-hepler'

type ProductType = {
  _id: string
  name: string
  price: number
  image: string
  description: string
  createdAt: string
}

async function getData(): Promise<ProductType[]> {
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

  const groupedProducts = products.reduce((acc, product) => {
    // @ts-ignore
    if(!acc[product.createdAt]) {
  // @ts-ignore
      acc[product.createdAt] = []
    }
  // @ts-ignore

    acc[product.createdAt].push(product)
    return acc
  }, {});

  // const onDownloadClick = (products:any) => {
  //   const jsonStrigify = JSON.stringify(products)
  //   downloadJson(jsonStrigify, 'cart.json')
  // }

  console.log({groupedProducts})
  const simplyProducts = products.map((product) => {
    return {
      ...product,
      _id: product._id.toString()
    }
  }).reverse()
  return (    
    Object.entries(groupedProducts).map(([date, products]) => {
      return (
        <div key={date}>
          <p>{date}</p>
            
           {// @ts-ignore
           products.map((product) => {
              return <div key={product.name}>{product.name}</div>
            })}
        </div>
      )
    }
  ));
}

export default ProductsGetter;