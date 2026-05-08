import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { success } from "zod";

function buildBilibiliPartitionMapping(zoneData: any[]) {
  const idMapping = [];

  for (const parent of zoneData) {
    if (typeof parent !== "object" || parent === null) {
      continue;
    }

    const parentTid = parent.tid;
    const parentName = parent.name;

    if (
      parentTid === undefined ||
      parentTid === null ||
      parentTid === 0 ||
      parentTid === "0" ||
      !parentName
    ) {
      continue;
    }

    idMapping.push({
      category: parentName,
      partitions: [
        {
          id: String(parentTid),
          name: parentName,
          sub_partitions: (parent.sub || [])
            .filter(
              (sub: any) =>
                typeof sub === "object" &&
                sub !== null &&
                sub.tid !== undefined &&
                sub.tid !== null &&
                sub.tid !== 0 &&
                sub.tid !== "0" &&
                sub.name,
            )
            .map((sub: any) => ({
              id: String(sub.tid),
              name: sub.name,
            })),
        },
      ],
    });
  }

  return idMapping;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // json 文件路径
    const filePath = path.join(
      process.cwd(),
      "data",
      "bilibili-video-zone.json",
    );

    // 读取文件
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // 转 json
    const data = JSON.parse(jsonData);

    // 转换结构
    const mappingData = buildBilibiliPartitionMapping(data);

    // 返回
    return res.status(200).json({
      success: true,
      data: mappingData,
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, errorMessage: `方法 ${req.method} 不允许` });
  }
}
