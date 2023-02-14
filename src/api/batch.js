import request from '@/utils/request'

const apiHost = 'http://taskapi.belongme.top'

export default {
  // 获取批次列表, 分页查询
  getBatchListPage(searchBatch, page, pageSize) {
    return request({
      url: `${apiHost}/batch/listPage/${page}/${pageSize}`,
      method: 'get',
      params: searchBatch
    })
  },
  // 获取批次列表，后端判断是否已提交
  getBatchListIsCommit(searchBatch, page, pageSize) {
    return request({
      url: `${apiHost}/batch/listPageIsCommit/${page}/${pageSize}`,
      method: 'get',
      params: searchBatch
    })
  },
  // 获取批次列表，后端判断是否已提交，返回提交人总数和用户总数
  getBatchListIsCommitAndCount(searchBatch, page, pageSize) {
    return request({
      url: `${apiHost}/batch/listPageIsCommitAndCount/${page}/${pageSize}`,
      method: 'get',
      params: searchBatch
    })
  },
  addBatch(batch) {
    return request({
      url: `${apiHost}/batch/add`,
      method: 'post',
      data: batch
    })
  },
  getBatchById(batchId) {
    return request({
      url: `${apiHost}/batch/get/${batchId}`,
      method: 'get'
    })
  },
  updateBatch(batch) {
    return request({
      url: `${apiHost}/batch/update`,
      method: 'put',
      data: batch
    })
  },
  deleteByBatchId(batchId) {
    return request({
      url: `${apiHost}/batch/delete/${batchId}`,
      method: 'delete'
    })
  },
  updateStatus(batchId, status) {
    return request({
      url: `${apiHost}/batch/updateStatus/${batchId}/${status}`,
      method: 'put'
    })
  }
}
