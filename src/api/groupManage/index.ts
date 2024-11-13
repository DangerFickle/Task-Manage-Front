import {request} from "@/utils/service"
import {ApiResponse} from "../../../types/api";
import {SearchGroup} from "@/api/groupManage/type/SearchGroup";
import {GroupManage} from "@/api/groupManage/type/GroupManage";
import {User} from "@/api/user/types/user";

export function getGroupList(searchGroup: SearchGroup, page: number, pageSize: number) {
  return request<ApiResponse<GroupManage>>({
    url: `/groupManage/listPage/${page}/${pageSize}`,
    method: 'get',
    params: searchGroup
  })
}

export function getGroupMembers(groupId: number, page: number, pageSize: number, name: string) {
  return request<ApiResponse<User>>({
    url: `groupManage/groupMembers/${page}/${pageSize}`,
    method: 'get',
    params: {groupId, name}
  })
}
export function getGroupMembersNotPage(groupId: number) {
  return request<ApiResponse<User>>({
    url: `groupManage/getGroupMembersNotPage`,
    method: 'get',
    params: {groupId}
  })
}

export function editGroupLeader(groupId: number, newLeaderId: string) {
  return request<ApiResponse<User>>({
    url: `groupManage/editLeader`,
    method: 'put',
    params: {groupId, newLeaderId}
  })
}

export function deleteGroup(groupId: number) {
  return request<ApiResponse<User>>({
    url: `groupManage/deleteGroup`,
    method: 'delete',
    params: {groupId}
  })
}
export function adjustMembers(groupId: number, newMembers: Array<string>, newLeader: Array<string>) {
  return request<ApiResponse<User>>({
    url: `groupManage/adjustMembers/${groupId}/${newLeader[0]}`,
    method: 'put',
    data: newMembers
  })
}
