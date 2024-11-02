export interface User {
  id?: string
  username?: string
  password?: string
  name?: string
  studentNumber?: string
  roleId?: string
  roleName?: string
  oleName?: string
  email?: string
  hasEmail?: boolean
  avatar?: string
  // 状态（1：正常 0：停用）
  status?: number
  createTime?: Date
  updateTime?: Date
}
