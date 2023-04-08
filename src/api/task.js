import request from '@/utils/request'

export default {
  // 提交作业，上传文件
  commitTask(formData, commitTaskComponent) {
    return request({
      url: `/task/commitTask`,
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
      url: `/task/cancelCommit/${batchId}`,
      method: 'delete'
    })
  },
  // 根据作业id下载单个文件，传入taskDetailComponent组件实例，用于更新进度条
  downloadTaskFile(taskId, taskDetailComponent) {
    return request({
      url: `/task/downloadTask/${taskId}`,
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
  downloadSelfTaskFile(belongBatchId, taskDetailComponent) {
    return request({
      url: `/task/downloadSelfTask/${belongBatchId}`,
      method: 'get',
      responseType: 'blob',
      onDownloadProgress(progressEvent) {
        // 更新进度条
        const progressBar = Math.round(progressEvent.loaded / progressEvent.total * 100);
        if (progressBar >= 99) {
          taskDetailComponent.percentage = 99
          taskDetailComponent.downloadPercentageDialogVisible = false //  关闭下载环形进度条的弹窗
        } else {
          taskDetailComponent.percentage = progressBar
        }
      }
    })
  },
  // 根据批次id，下载全部文件, 传入taskDetailComponent组件实例，用于更新进度条
  downloadBatchFiles(batchId, taskDetailComponent) {
    return request({
      url: `/task/downloadBatch/${batchId}`,
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
