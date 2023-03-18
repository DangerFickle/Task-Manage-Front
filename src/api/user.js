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
      url: `/user/noCommitUserList/${page}/${pageSize}`,
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
  },
  // 获取用户信息列表
  getUserList(searchUserInfo, page, pageSize) {
    return request({
      url: `/user/listPage/${page}/${pageSize}`,
      method: 'get',
      params: searchUserInfo
    })
  },
  // 添加用户
  addUser(userForm) {
    return request({
      url: `/user/add`,
      method: 'post',
      data: userForm
    })
  },
  // 更新用户信息
  updateUser(user) {
    return request({
      url: `/user/update`,
      method: 'put',
      data: user
    })
  },
  // 获取指定用户的信息
  getUserById(userId) {
    return request({
      url: `/user/getUserById/${userId}`,
      method: 'get'
    })
  },
  // 删除指定用户
  deleteById(userId) {
    return request({
      url: `/user/delete/${userId}`,
      method: 'delete'
    })
  },
  // 切换可用性
  switchStatus(userId) {
    return request({
      url: `/user/switchStatus/${userId}`,
      method: 'put'
    })
  }
}
