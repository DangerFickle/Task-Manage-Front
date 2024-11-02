import { request } from "@/utils/service"
import { ApiResponse } from "../../../types/api";
import { Group } from "@/api/group/type/group";

export function createGroup(searchGroup: {belongCourseId: string, groupIndex: number | null}) {
  return request<ApiResponse<Group>>({
    url: `/group/create`,
    method: 'post',
    params: searchGroup
  })
}
export function getGroup(page: number, pageSize: number, belongCourse: string) {
  return request<ApiResponse<Group>>({
    url: `/group/${belongCourse}/${page}/${pageSize}`,
    method: 'get'
  })
}

export function transferLeader(transferUserId: string | undefined, groupId: string) {
  return request<ApiResponse<null>>({
    url: `/group/transferLeader/${transferUserId}/${groupId}`,
    method: "put"
  });
}

export function kickOut(groupId: string, userId: string | undefined) {
  return request<ApiResponse<Group>>({
    url: `/group/kick/${groupId}/${userId}`,
    method: 'delete'
  })
}

export function quitGroup(groupId: string) {
  return request<ApiResponse<Group>>({
    url: `/group/quit/${groupId}`,
    method: 'delete'
  })
}

export function addMember(userId: string | undefined, groupId: string) {
  return request<ApiResponse<Group>>({
    url: `/group/addMember/${userId}/${groupId}`,
    method: 'post'
  })
}
