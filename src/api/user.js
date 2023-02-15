import request from '@/utils/request'

export default {
  login(data) {
    return request({
      url: `/user/login`,
      method: 'post',
      data
    })
  },
  logout() {
    return request({
      url: `/user/logout`,
      method: 'get'
    })
  },
  getUserInfo() {
    return request({
      url: `/user/info`,
      method: 'get'
    })
  },
  getNoCommitUserList(searchNoCommitUser, page, pageSize) {
    return request({
      url: `}/user/noCommitUserList/${page}/${pageSize}`,
      method: 'get',
      params: searchNoCommitUser
    })
  },
  // 重置密码
  resetPassword(passwordForm) {
    return request({
      url: `/user/resetPassword`,
      method: 'put',
      params: passwordForm
    })
  },
  // 修改邮箱
  updateEmail(emailForm) {
    return request({
      url: `/user/updateEmail`,
      method: 'put',
      params: emailForm
    })
  }
}
