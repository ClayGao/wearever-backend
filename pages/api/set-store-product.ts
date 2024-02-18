
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/framework/mongodb"
import { ObjectId } from "mongodb"; // 引入 ObjectId
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  if (req.method === "POST") {
    const ids = req.body.ids; // 接收传入的数组
    const action = req.body.action; // 接收传入的 action

    // 将字符串 id 转换为 ObjectId
    // @ts-ignore
    const objectIds = ids.map(id => new ObjectId(id));

    // 使用 $in 操作符匹配数组中的 _id，然后更新匹配的文档
    const result = await db.collection('store').updateMany(
      { _id: { $in: objectIds } },
      { $set: { isAlreadyInSheet: action } }
    );

    // 返回更新结果
    res.status(200).json({ message: "更新成功", modifiedCount: result.modifiedCount });
  } else {
    // 如果不是 POST 请求，返回错误
    res.status(405).json({ message: "只接受 POST 请求" });
  }
}
