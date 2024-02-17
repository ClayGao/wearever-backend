import { getNewProducts } from "../../e2e-handlers/getNewProducts";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await getNewProducts();
  res.send(result);
}
