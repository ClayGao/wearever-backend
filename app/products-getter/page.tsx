import { connectToDatabase } from "@/framework/mongodb"
import { ProductListContainer } from '@/src/containers/ProductListContainer';


async function getData() {
  const { db } = await connectToDatabase();
  const products = await db.collection('store').find({}).toArray();
  return products 
}

export default async function ProductsGetter() {
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