import { getNewProducts } from "../../e2e-handlers/getNewProducts";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/framework/mongodb"
import { compareArrAndReturnNew } from "@/utils/compare";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await getNewProducts();
  try {
    const { db } = await connectToDatabase();
    const temp = await db.collection('temp').find({}).toArray() || [];
    if (temp.length <= 0) {
      // 如果 temp 原本就空的，那就不用比對，把這次的資料作為 init 存為 temp
      await db.collection('temp').drop();
      await db.collection('temp').insertMany(result);
      res.status(500).json({ message: 'No temp data found' });
    }
    // @ts-ignore TODO: fix type error
    const newProducts = compareArrAndReturnNew(temp, result);
    if (newProducts.length <= 0) {
      // 刪除原本的 temp，目的是作為清空來用
      await db.collection('temp').drop();
      // 把這次收集到的新品資料，放到新的 temp
      await db.collection('temp').insertMany(result);
      return res.status(500).json({ message: 'No new data found' });
    }
    const newProductsWithState = newProducts.map((product) => {
      return {
        ...product,
        isAlreadyInSheet: false
      }
    })
    // 把比對後的新商品，加到 store 之中
    const dbStoreRes = await db.collection('store').insertMany(newProductsWithState);
    // 刪除原本的 temp，目的是作為清空來用
    const dbTempDropRes = await db.collection('temp').drop();
    // 把這次收集到的新品資料，放到新的 temp
    const dbResponse = await db.collection('temp').insertMany(result);
    res.status(200).json({ message: 'Data inserted successfully', dbStoreRes });
  } catch(err) {
    res.status(500).json({ message: 'Internal database error' });
  }
}
