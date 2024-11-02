
export interface Course {
  id: string
  courseName?: string
  description?: string
  creatorName?: string
  modifierName?: string
  groupMaxMemberSize?: number | null
  groupMaxSize?: number | null
  status?: number
  createTime?: string
  updateTime?: string
}
export interface SearchCourse {
  courseName: string // 课程名称
  description: string // 课程描述
  creatorName: string // 创建者名字
  modifierName: string // 修改者名字
}

