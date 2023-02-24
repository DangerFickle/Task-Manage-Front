import request from '@/utils/request'

export default {
  remindUser(remindVo) {
    return request({
      url: `/email/remind`,
      method: 'get',
      params: remindVo
    })
  }
}
