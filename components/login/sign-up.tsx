import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/lib/request";
import { useState } from "react";

export const formSchema = z
  .object({
    username: z
      .string()
      .min(3, "用户名至少 3 个字符")
      .max(20, "用户名最多 20 个字符")
      .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字、下划线"),

    password: z
      .string()
      .min(6, "密码至少 6 位")
      .max(32, "密码最多 32 位")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/,
        "密码必须包含字母和数字",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await request.post("/api/sign-up", data);
      return res.data;
    },
    onSuccess: () => {
      setOpen(false);
      form.reset();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "注册失败");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      username: values.username,
      password: values.password,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <a href="#" className="underline underline-offset-4">
          注册
        </a>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>注册</DialogTitle>
          <DialogDescription>
            请在此处修改您的个人资料。完成后，点击保存。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>

                  <FormControl>
                    <Input placeholder="请输入用户名" {...field} />
                  </FormControl>

                  <FormDescription>用户名将作为公开显示名称。</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请输入密码"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    密码至少 6 位，并包含字母和数字。
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请再次输入密码"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>请再次输入密码进行确认。</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full">
                注册
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
