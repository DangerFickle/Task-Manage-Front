import request from '@/utils/request'

const apiHost = 'http://192.168.31.110:8888'

export default {
  // 根据所属批次获取作业详情，分页查询
  getDetailsByBatchId(searchTaskDetails, page, pageSize) {
    return request({
      url: `${apiHost}/taskDetails/listPage/${page}/${pageSize}`,
      method: 'get',
      params: searchTaskDetails
    })
  }
}
