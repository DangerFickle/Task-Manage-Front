import { request } from "@/utils/service"
import { ElMessage } from "element-plus"
import { ApiResponse } from "../../../types/api";

export default {
  // 导出excel
  exportNotCommit(searchNoCommitUser: {
    studentName: string,
    belongBatchId: string
  }) {
    let isFirstRun = false
    return request<ApiResponse<null>>({
      url: "/excel/notCommit",
      method: "get",
      params: searchNoCommitUser,
      responseType: "blob",
      onDownloadProgress(progressEvent) {
        // 提示用户正在下载，在下载过程中只提示一次
        if (isFirstRun) {
          ElMessage.success("正在导出未提交名单，请稍后")
          isFirstRun = true
        }
      }
    })
  }
}
