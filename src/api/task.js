import request from '@/utils/request'

const apiHost = 'http://192.168.31.110:8888'

export default {
  // 提交作业，上传文件
  commitTask(formData) {
    return request({
      url: `${apiHost}/task/commitTask`,
      method: 'post',
      data: formData
    })
  },
  // 取消提交作业
  cancelCommitTask(batchId) {
    return request({
      url: `${apiHost}/task/cancelCommit/${batchId}`,
      method: 'delete'
    })
  },
  // 根据作业id下载单个文件
  downloadTaskFile(taskId) {
    return request({
      url: `${apiHost}/task/downloadTask/${taskId}`,
      method: 'get',
      responseType: 'blob'
    })
  },
  // 根据批次id，下载全部文件
  downloadTaskFiles(batchId) {
    return request({
      url: `${apiHost}/task/downloadBatch/${batchId}`,
      method: 'get',
      responseType: 'blob'
    })
  }
}
