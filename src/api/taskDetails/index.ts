import { request } from "@/utils/service"
import { ApiResponse } from "../../../types/api";
import { TaskDetails } from "@/api/taskDetails/types/taskDetails";
import { Page } from "@/api/paging/page";

export default {
  // 根据所属批次获取作业详情，分页查询
  getDetailsByBatchId(searchTaskDetails: {
    studentName: string,
    belongBatchId: string
  }, page: number, pageSize: number) {
    return request<ApiResponse<Page<TaskDetails>>>({
      url: `/taskDetails/listPage/${page}/${pageSize}`,
      method: "get",
      params: searchTaskDetails
    })
  },
  getGroupDetailsByBatchId(searchTaskDetails: {
    studentName: string,
    belongBatchId: string
  }, page: number, pageSize: number) {
    return request<ApiResponse<Page<TaskDetails>>>({
      url: `/taskDetails/listGroupPage/${page}/${pageSize}`,
      method: "get",
      params: searchTaskDetails
    })
  }
}
