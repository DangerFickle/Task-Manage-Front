import request from '@/utils/request'

export default {
  getRoleList() {
    return request({
      url: `/role/list`,
      method: 'get'
    })
  }
}
