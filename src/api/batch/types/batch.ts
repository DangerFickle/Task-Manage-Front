export interface Batch {
  id: string
  batchName?: string // 批次名称
  batchType?: string // 批次类型
  description?: string // 批次描述
  belongCourseId?: string // 所属课程id
  belongCourseName?: string // 所属课程名称
  endTime?: string // 批次截至时间
  isEnd?: number // 批次是否已截止
  isCommit?: number // 批次是否已提交
  alreadyCount?: number // 批次已交数
  totalCount?: number // 人或群的总数
  sizeOfDirectory?: number // 批次文件夹内的文件大小
  createTime?: string
  updateTime?: string
}
export interface SearchBatch {
  belongCourseId?: string // 所属课程中被选中课程的id
  batchName?: string // 批次名称
  batchType?: string // 批次类型
  description?: string // 批次描述
  creatorName?: string // 创建者
  modifierName?: string // 修改者
  isCommit?: string // 批次是否已提交
  isEnd?: string // 批次是否已截止
}

