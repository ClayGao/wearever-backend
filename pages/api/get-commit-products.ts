

import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/framework/mongodb"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { db } = await connectToDatabase();
  const products = await db.collection('commits').find({}).toArray();
  res.status(200).json(products);
}
