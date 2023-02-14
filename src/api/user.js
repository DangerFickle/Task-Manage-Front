import request from '@/utils/request'

const apiHost = process.env.VUE_APP_TASK_API
export default {
  login(data) {
    return request({
      url: `${apiHost}/user/login`,
      method: 'post',
      data
    })
  },
  logout() {
    return request({
      url: `${apiHost}/user/logout`,
      method: 'get'
    })
  },
  getUserInfo() {
    return request({
      url: `${apiHost}/user/info`,
      method: 'get'
    })
  },
  getNoCommitUserList(searchNoCommitUser, page, pageSize) {
    return request({
      url: `${apiHost}/user/noCommitUserList/${page}/${pageSize}`,
      method: 'get',
      params: searchNoCommitUser
    })
  },
  // 重置密码
  resetPassword(passwordForm) {
    return request({
      url: `${apiHost}/user/resetPassword`,
      method: 'put',
      params: passwordForm
    })
  },
  // 修改邮箱
  updateEmail(emailForm) {
    return request({
      url: `${apiHost}/user/updateEmail`,
      method: 'put',
      params: emailForm
    })
  }
}
