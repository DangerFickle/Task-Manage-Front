import { request } from "@/utils/service"
import { ApiResponse } from "../../../types/api";
export default {
  remindUser(remindVo: { userId: string, batchId: string }) {
    return request<ApiResponse<null>>({
      url: `/email/remind`,
      method: "get",
      params: remindVo
    })
  }
}
