import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username 和 password 必填" });
    }

    // 1. 检查用户是否存在
    const exists = await prisma.users.findFirst({
      where: {
        OR: [{ username }],
      },
    });

    if (exists) {
      return res.status(400).json({ message: "用户已存在" });
    }

    // 2. 密码加密
    const password_hash = await bcrypt.hash(password, 10);

    // 3. 写入数据库
    const user = await prisma.users.create({
      data: {
        username,
        password_hash,
      },
    });

    return res.status(200).json({
      message: "创建成功",
      user: {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`方法 ${req.method} 不允许`);
  }
}
