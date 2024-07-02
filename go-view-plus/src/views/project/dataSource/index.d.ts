export type DataSourceType = {
  id: number
  name: string
  host: string
  username: string
  password: string
  database: string
  port: number
  charset: string
  remark: string
  type: string
  remark: string
  created_at: string
  updated_at: string
  type: string
  createTime: string
  createUserId: number
}

export type DataSourceItemType = {
  id: number
  name: string
  type: null | string
  host: string
  port: number
  username: string
  password: string
  database: string
  charset: string
  remark: string
}
