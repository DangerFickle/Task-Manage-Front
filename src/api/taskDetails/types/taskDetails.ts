export interface TaskDetails {
  taskId?: string
  studentName?: string
  groupName?: string
  studentNumber?: string
  belongCourseName?: string
  belongBatchName?: string
  // 所属批次是否已截止
  isEnd?: number
  fileSize?: number
  // 作业的文件路径，此字段不需要传递给前端
  filePath?: string
  // 所属批次截止时间，此字段不需要传递给前端
  belongBatchEndTime?: string
  createTime?: string
}
