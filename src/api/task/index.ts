import { request } from "@/utils/service"
import { Ref } from "vue"
import { ApiResponse } from "../../../types/api";

export default {
  secondTransmit(formData: FormData) {
    return request<ApiResponse<null>>({
      headers: {
        "Content-Type": "multipart/form-data"
      },
      url: `/task/secondTransmit`,
      method: "post",
      data: formData
    })
  },
  checkFileExist(fileSha256: string, fileType: string) {
    return request<ApiResponse<null>>({
      url: `/task/checkFileExist`,
      method: "get",
      params: {
        fileSha256,
        fileType
      }
    })
  },
  // 提交作业，上传文件
  commitTask(formData: FormData, percentage: Ref<number>, percentageDialogVisible: Ref<boolean>) {
    return request<ApiResponse<null>>({
      headers: {
        "Content-Type": "multipart/form-data"
      },
      url: `/task/commitTask`,
      method: "post",
      data: formData,
      // 上传进度钩子
      onUploadProgress(progressEvent) {
        // 更新进度条
        if (progressEvent.total) {
          const progressBar = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          if (progressBar >= 99) {
            percentage.value = 99
            percentageDialogVisible.value = false //  关闭上传环形进度条的弹窗
          } else {
            percentage.value = progressBar
          }
        }

      }
    })
  },
  // 取消提交作业
  cancelCommitTask(batchId: string) {
    return request<ApiResponse<null>>({
      url: `/task/cancelCommit/${batchId}`,
      method: "delete"
    })
  },
  // 根据作业id下载单个文件，传入taskDetailComponent组件实例，用于更新进度条
  downloadTaskFile(taskId: string, percentage: Ref<number>, percentageDialogVisible: Ref<boolean>) {
    return request<ApiResponse<null>>({
      url: `/task/downloadTask/${taskId}`,
      method: "get",
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        // 更新进度条
        if (progressEvent.total) {
          const progressBar = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          if (progressBar >= 99) {
            percentage.value = 99
            percentageDialogVisible.value = false //  关闭下载环形进度条的弹窗
          } else {
            percentage.value = progressBar
          }
        }
      }
    })
  },
  downloadSelfTaskFile(belongBatchId: string, percentage: Ref<number>, downloadPercentageDialogVisible: Ref<boolean>) {
    return request<ApiResponse<null>>({
      url: `/task/downloadSelfTask/${belongBatchId}`,
      method: "get",
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        // 更新进度条
        if (progressEvent.total) {
          const progressBar = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          if (progressBar >= 99) {
            percentage.value = 99
            downloadPercentageDialogVisible.value = false //  关闭下载环形进度条的弹窗
          } else {
            percentage.value = progressBar
          }
        }
      }
    })
  },
  // 根据批次id，下载全部文件, 传入taskDetailComponent组件实例，用于更新进度条
  downloadBatchFiles(batchId: string, percentage: Ref<number>, percentageDialogVisible: Ref<boolean>) {
    return request<ApiResponse<null>>({
      url: `/task/downloadBatch/${batchId}`,
      method: "get",
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        // 更新进度条
        if (progressEvent.total) {
          const progressBar = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          if (progressBar >= 99) {
            percentage.value = 99
            percentageDialogVisible.value = false //  关闭下载环形进度条的弹窗
          } else {
            percentage.value = progressBar
          }
        }
      }
    })
  }
}
