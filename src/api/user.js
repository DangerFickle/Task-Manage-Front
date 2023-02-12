import request from '@/utils/request'

const apiHost = 'http://192.168.31.110:8888'
export default {
  login(data) {
    return request({
      url: `${apiHost}/user/login`,
      method: 'post',
      data
    })
  },
  getUserInfo() {
    return request({
      url: `${apiHost}/user/info`,
      method: 'get'
    })
  },
  logout() {
    return request({
      url: `${apiHost}/user/logout`,
      method: 'get'
    })
  }
}
