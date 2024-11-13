import {request} from "@/utils/service";
import {LoginRequestData} from "@/api/login/types/login";
import {User} from "@/api/user/types/user";
import {ApiResponse} from "../../../types/api";
import {Page} from "@/api/paging/page";

export default {
  login(data: LoginRequestData) {
    return request<ApiResponse<null>>({
      url: `/user/login`,
      method: "post",
      data
    });
  },
  logout() {
    return request<ApiResponse<null>>({
      url: `/user/logout`,
      method: "get"
    });
  },
  getNoCommitUserList(searchNoCommitUser: {
    studentName: string,
    belongBatchId: string
  }, page: number, pageSize: number) {
    return request<ApiResponse<Page<User>>>({
      url: `/user/noCommitUserList/${page}/${pageSize}`,
      method: "get",
      params: searchNoCommitUser
    });
  },
  getNoCommitGroupList(searchNoCommitGroup: {
    groupName: string,
    belongBatchId: string
  }, page: number, pageSize: number) {
    return request<ApiResponse<Page<User>>>({
      url: `/group/noCommitGroupList/${page}/${pageSize}`,
      method: "get",
      params: searchNoCommitGroup
    });
  },
  // 重置密码
  resetPassword(passwordForm: {
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  }) {
    return request<ApiResponse<null>>({
      url: `/user/resetPassword`,
      method: "put",
      params: passwordForm
    });
  },
  // 修改邮箱
  updateEmail(emailForm: {
    password: string,
    email: string
  }) {
    return request<ApiResponse<null>>({
      url: `/user/updateEmail`,
      method: "put",
      params: emailForm
    });
  },
  // 获取用户信息列表
  getUserList(searchUserInfo: User, page: number, pageSize: number) {
    return request<ApiResponse<Page<User>>>({
      url: `/user/listPage/${page}/${pageSize}`,
      method: "get",
      params: searchUserInfo
    });
  },
  getTransMemberList(transMemberPageInfo: { groupId: string, name: string, page: number, pageSize: number }) {
    return request<ApiResponse<Page<User>>>({
      url: `/group/pageGroupMembers`,
      method: "get",
      params: transMemberPageInfo
    });
  },
  // 获取用户信息列表
  getUserListWithoutMember(searchUserInfo: User, page: number, pageSize: number) {
    return request<ApiResponse<Page<User>>>({
      url: `/user/listGroupPage/${page}/${pageSize}`,
      method: "get",
      params: searchUserInfo
    });
  },
  // 获取用户信息列表，不分页
  getUserListWithoutMemberNotPage(searchUserInfo: User) {
    return request<ApiResponse<Page<User>>>({
      url: `/user/listGroupMemberNotPage`,
      method: "get",
      params: searchUserInfo
    });
  },
  // 添加用户
  addUser(userForm: User) {
    return request<ApiResponse<null>>({
      url: `/user/add`,
      method: "post",
      data: userForm
    });
  },
  // 添加用户
  addUserBatch(userList: Array<User>) {
    return request<ApiResponse<null>>({
      url: `/user/addBatch`,
      method: "post",
      data: userList
    });
  },
  // 更新用户信息
  updateUser(user: User) {
    return request<ApiResponse<null>>({
      url: `/user/update`,
      method: "put",
      data: user
    });
  },
  // 获取指定用户的信息
  getUserById(userId: string) {
    return request<ApiResponse<User>>({
      url: `/user/getUserById/${userId}`,
      method: "get"
    });
  },
  // 删除指定用户
  deleteById(userId: string) {
    return request<ApiResponse<null>>({
      url: `/user/delete/${userId}`,
      method: "delete"
    });
  },
  // 切换可用性
  switchStatus(userId: string) {
    return request<ApiResponse<null>>({
      url: `/user/switchStatus/${userId}`,
      method: "put"
    });
  }
};
