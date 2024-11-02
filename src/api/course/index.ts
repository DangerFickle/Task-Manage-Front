import { request } from "@/utils/service"
import { SearchCourse, Course } from "./type/course"
import { ApiResponse } from "../../../types/api";
import { Page } from "@/api/paging/page";
export default {
  getCourseListPage(searchCourse: SearchCourse, page: number, pageSize: number) {
    return request<ApiResponse<Page<Course>>>({
      url: `/course/listPage/${page}/${pageSize}`,
      method: "get",
      params: searchCourse
    })
  },
  getCourseListOnlyEnabled() {
    return request<ApiResponse<Array<Course>>>({
      url: `/course/listOnlyEnabled`,
      method: "get"
    })
  },
  updateStatus(id: string, status: number) {
    return request<ApiResponse<null>>({
      // 接口路径
      url: `/course/updateStatus/${id}/${status}`,
      method: "put" // 提交方式
    })
  },
  addCourse(course: Course) {
    return request<ApiResponse<null>>({
      url: `/course/add`,
      method: "post",
      data: course
    })
  },
  getCourseById(id: string) {
    return request<ApiResponse<Course>>({
      url: `/course/get/${id}`,
      method: "get"
    })
  },
  updateCourse(course: Course) {
    return request<ApiResponse<null>>({
      url: `/course/update`,
      method: "put",
      data: course
    })
  },
  deleteCourseById(courseId: string) {
    return request<ApiResponse<null>>({
      url: `/course/delete/${courseId}`,
      method: "delete"
    })
  },
  deleteBatchByIds(courseIds: string[]) {
    return request<ApiResponse<null>>({
      url: `/course/deleteBatch`,
      method: "delete",
      data: courseIds
    })
  }
}
