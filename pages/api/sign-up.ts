import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { username, password } = req.body;
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`方法 ${req.method} 不允许`);
  }
}
