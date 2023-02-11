import request from '@/utils/request'

const apiHost = 'http://192.168.31.31:8888'

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
  }
}
