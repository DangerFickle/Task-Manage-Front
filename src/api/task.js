import request from '@/utils/request'

const apiHost = process.env.VUE_APP_TASK_API

export default {
  // 提交作业，上传文件
  commitTask(formData, commitTaskComponent) {
    return request({
      url: `${apiHost}/task/commitTask`,
      method: 'post',
      data: formData,
      // 上传进度钩子
      onUploadProgress(progressEvent) {
        // 更新进度条
        const progressBar = Math.round(progressEvent.loaded / progressEvent.total * 100)
        if (progressBar >= 99) {
          commitTaskComponent.percentage = 99
          commitTaskComponent.percentageDialogVisible = false //  关闭上传环形进度条的弹窗
        } else {
          commitTaskComponent.percentage = progressBar
        }
      }
    })
  },
  // 取消提交作业
  cancelCommitTask(batchId) {
    return request({
      url: `${apiHost}/task/cancelCommit/${batchId}`,
      method: 'delete'
    })
  },
  // 根据作业id下载单个文件，传入taskDetailComponent组件实例，用于更新进度条
  downloadTaskFile(taskId, taskDetailComponent) {
    return request({
      url: `${apiHost}/task/downloadTask/${taskId}`,
      method: 'get',
      responseType: 'blob',
      onDownloadProgress(progressEvent) {
        // 更新进度条
        const progressBar = Math.round(progressEvent.loaded / progressEvent.total * 100);
        if (progressBar >= 99) {
          taskDetailComponent.percentage = 99
          taskDetailComponent.percentageDialogVisible = false //  关闭下载环形进度条的弹窗
        } else {
          taskDetailComponent.percentage = progressBar
        }
      }
    })
  },
  // 根据批次id，下载全部文件, 传入taskDetailComponent组件实例，用于更新进度条
  downloadBatchFiles(batchId, taskDetailComponent) {
    return request({
      url: `${apiHost}/task/downloadBatch/${batchId}`,
      method: 'get',
      responseType: 'blob',
      onDownloadProgress(progressEvent) {
        // 更新进度条
        const progressBar = Math.round(progressEvent.loaded / progressEvent.total * 100);
        if (progressBar >= 99) {
          taskDetailComponent.percentage = 99
          taskDetailComponent.percentageDialogVisible = false //  关闭下载环形进度条的弹窗
        } else {
          taskDetailComponent.percentage = progressBar
        }
      }
    })
  }
}
