
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

    // @ts-ignore
    const objectIds = ids.map(id => new ObjectId(id));

    const result = await db.collection('store').updateMany(
      { _id: { $in: objectIds } },
      { $set: { isAlreadyInSheet: action } }
    );

    res.status(200).json({ message: "更新成功", modifiedCount: result.modifiedCount });
  } else {
    res.status(405).json({ message: "只接受 POST 請求" });
  }
}
