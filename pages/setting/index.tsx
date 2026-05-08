import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/request";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Setting() {
  const { data } = useQuery({
    queryKey: ["bilibili-zones"],
    queryFn: async () => {
      const res = await request.get("/api/bilibili-zone-data");
      return res.data;
    },
  });

  return (
    <>
      <PageHeader
        title="运行概览"
        description="把最常改的自动化、投稿和审核设置集中在一页，减少来回切换。"
      />
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 mt-5">
        <div className="rounded-xl bg-muted/50">
          <Card className="min-h-48">
            <CardHeader>
              <CardTitle>常用流程</CardTitle>
              <CardDescription>自动化流程</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    启用无人值守自动投稿
                  </label>
                </div>
                <p className="mt-2 text-gray-500 text-sm">
                  自动完成下载、翻译、生成素材与投稿，适合日常批量运行。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="rounded-xl bg-muted/50">
          <Card className="min-h-48">
            <CardHeader>
              <CardTitle>投稿设置</CardTitle>
              <CardDescription>投稿策略</CardDescription>
            </CardHeader>
            <CardContent>
              <Label>bilibili 固定分区</Label>
              {data && (
                <>
                  <Select>
                    <SelectTrigger className="w-[280px] mt-2">
                      <SelectValue placeholder="选择一个固定分区" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.map((item: any) => (
                        <SelectGroup key={item.category}>
                          <SelectLabel>{item.category}</SelectLabel>

                          {item.partitions.map((partition: any) => (
                            <div key={partition.id}>
                              {/* 主分区 */}
                              <SelectItem
                                value={String(partition.id)}
                                className="pl-4 font-medium"
                              >
                                {partition.name}（{partition.id}）
                              </SelectItem>

                              {/* 子分区 */}
                              {partition.sub_partitions.map((sub: any) => (
                                <SelectItem
                                  key={sub.id}
                                  value={String(sub.id)}
                                  className="pl-10 text-muted-foreground"
                                >
                                  └ {sub.name}（{sub.id}）
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-10 flex justify-end">
        <Button>保存设置</Button>
      </div>
    </>
  );
}
