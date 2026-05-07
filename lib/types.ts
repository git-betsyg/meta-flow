/** 分页数据结构 */
export interface PaginatedData<T> {
  list: T[]       // 当前页数据列表
  current: number // 当前页码
  pageSize: number // 每页条数
  total: number   // 总条数
}

/** 通用接口响应结构 */
export interface ApiResponse<T> {
  success: boolean // 请求是否成功
  data?: T         // 响应数据（失败时可能为空）
}

/** 分页接口响应（ApiResponse + PaginatedData 的组合） */
export type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>
