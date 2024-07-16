
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/framework/mongodb"
import { getTodayDate } from "@/utils/getToday"
import { ObjectId } from "mongodb"; // 引入 ObjectId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const cart = req.body.cart; // 接收传入的数组

  // 假設 objectIds 是一個包含 _id 值的數組
  // 創建要插入的文檔數組
  const documentsToInsert = cart.map(cartItem => ({
    ...cartItem,
    _id: new ObjectId(cartItem.id), // 如果 id 不是 ObjectId 實例，需要轉換
    isAlreadyInSheet: true,
    commitedAt: getTodayDate()
  }));

  // 執行 insertMany 操作
  try {
    const result = await db.collection('commits').insertMany(documentsToInsert, { ordered: false });
    console.log(`成功插入 ${result.insertedCount} 個文檔`);
    res.status(200).json({ message: "commit 成功", insertedCount: result.insertedCount });
  } catch (error) {
    if (error.code === 11000) {
      // 處理重複鍵錯誤
      console.log('部分文檔可能已存在，已跳過重複項');
    } else {
      console.error('插入操作失敗:', error);
      throw error; // 或者根據您的錯誤處理策略處理錯誤
    }
  }
}
