import axios, { AxiosRequestConfig } from "axios";
import { isBrowser } from "@/lib/is-browser";

interface CreateAxiosOptions {
  config?: AxiosRequestConfig;
}

export const createAxiosByInterceptors = ({
  config,
}: CreateAxiosOptions = {}) => {
  const instance = axios.create({
    timeout: 0,
    withCredentials: true,
    ...config,
  });

  // 请求拦截：注入 Bearer Token
  instance.interceptors.request.use((reqConfig) => {
    return reqConfig;
  });

  // 响应拦截：直接返回 data，二进制响应保留完整 response
  instance.interceptors.response.use(
    (response) => {
      const isBinary =
        response.config.responseType === "arraybuffer" ||
        response.config.responseType === "blob";
      return isBinary ? response : response.data;
    },
    (error) => {
      if (error.response) {
        // 浏览器端 401 跳转到登录页
        if (isBrowser && error.response.status === 401) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

/** 客户端使用：同源相对路径，不依赖构建期固定的站点地址 */
export const request = createAxiosByInterceptors({
  config: { baseURL: "" },
});
