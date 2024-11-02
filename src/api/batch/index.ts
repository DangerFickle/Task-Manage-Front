import { request } from "@/utils/service"
import { Batch, SearchBatch } from "@/api/batch/types/batch"
import { ApiResponse } from "../../../types/api";
import { Page } from "@/api/paging/page";

export default {
  // 获取批次列表, 分页查询
  getBatchListPage(searchBatch: SearchBatch, page: number, pageSize: number) {
    return request<ApiResponse<Page<Batch>>>({
      url: `/batch/listPage/${page}/${pageSize}`,
      method: "get",
      params: searchBatch
    })
  },
  // 获取批次列表，后端判断是否已提交
  getBatchListIsCommit(searchBatch: SearchBatch, page: number, pageSize: number) {
    return request<ApiResponse<Page<Batch>>>({
      url: `/batch/listPageIsCommit/${page}/${pageSize}`,
      method: "get",
      params: searchBatch
    })
  },
  // 获取批次列表，后端判断是否已提交，返回提交人总数和用户总数
  getBatchListIsCommitAndCount(searchBatch: SearchBatch, page: number, pageSize: number) {
    return request<ApiResponse<Page<Batch>>>({
      url: `/batch/listPageIsCommitAndCount/${page}/${pageSize}`,
      method: "get",
      params: searchBatch
    })
  },
  addBatch(batch: Batch) {
    return request<ApiResponse<null>>({
      url: `/batch/add`,
      method: "post",
      data: batch
    })
  },
  getBatchById(batchId: string) {
    return request<ApiResponse<Batch>>({
      url: `/batch/get/${batchId}`,
      method: "get"
    })
  },
  updateBatch(batch: Batch) {
    return request<ApiResponse<null>>({
      url: `/batch/update`,
      method: "put",
      data: batch
    })
  },
  deleteByBatchId(batchId: string) {
    return request<ApiResponse<null>>({
      url: `/batch/delete/${batchId}`,
      method: "delete"
    })
  },
  updateStatus(batchId: string, status: number) {
    return request<ApiResponse<null>>({
      url: `/batch/updateStatus/${batchId}/${status}`,
      method: "put"
    })
  }
}
