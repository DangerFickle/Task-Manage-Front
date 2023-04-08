import request from '@/utils/request'

export default {
  // 导出excel
  exportNotCommit(searchNoCommitUser, commitTaskComponent) {
    return request({
      url: '/excel/notCommit',
      method: 'get',
      params: searchNoCommitUser,
      responseType: 'blob',
      isFirstRun: false,
      onDownloadProgress(progressEvent) {
        // 提示用户正在下载，在下载过程中只提示一次
        if (!this.isFirstRun) {
          commitTaskComponent.$message.success('正在导出未提交名单，请稍后')
          this.isFirstRun = true
        }
      }
    })
  }
}
