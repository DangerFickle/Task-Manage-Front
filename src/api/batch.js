import request from '@/utils/request'

export default {
  // 获取批次列表, 分页查询
  getBatchListPage(searchBatch, page, pageSize) {
    return request({
      url: `/batch/listPage/${page}/${pageSize}`,
      method: 'get',
      params: searchBatch
    })
  },
  // 获取批次列表，后端判断是否已提交
  getBatchListIsCommit(searchBatch, page, pageSize) {
    return request({
      url: `/batch/listPageIsCommit/${page}/${pageSize}`,
      method: 'get',
      params: searchBatch
    })
  },
  // 获取批次列表，后端判断是否已提交，返回提交人总数和用户总数
  getBatchListIsCommitAndCount(searchBatch, page, pageSize) {
    return request({
      url: `/batch/listPageIsCommitAndCount/${page}/${pageSize}`,
      method: 'get',
      params: searchBatch
    })
  },
  addBatch(batch) {
    return request({
      url: `/batch/add`,
      method: 'post',
      data: batch
    })
  },
  getBatchById(batchId) {
    return request({
      url: `/batch/get/${batchId}`,
      method: 'get'
    })
  },
  updateBatch(batch) {
    return request({
      url: `/batch/update`,
      method: 'put',
      data: batch
    })
  },
  deleteByBatchId(batchId) {
    return request({
      url: `/batch/delete/${batchId}`,
      method: 'delete'
    })
  },
  updateStatus(batchId, status) {
    return request({
      url: `/batch/updateStatus/${batchId}/${status}`,
      method: 'put'
    })
  }
}
