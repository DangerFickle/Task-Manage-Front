import request from '@/utils/request'

export default {
  getCourseListPage(searchCourse, page, pageSize) {
    return request({
      url: `/course/listPage/${page}/${pageSize}`,
      method: 'get',
      params: searchCourse
    })
  },
  getCourseListOnlyEnabled() {
    return request({
      url: `/course/listOnlyEnabled`,
      method: 'get'
    })
  },
  updateStatus(id, status) {
    return request({
      // 接口路径
      url: `/course/updateStatus/${id}/${status}`,
      method: 'put' // 提交方式
    })
  },
  addCourse(course) {
    return request({
      url: `/course/add`,
      method: 'post',
      data: course
    })
  },
  getCourseById(id) {
    return request({
      url: `/course/get/${id}`,
      method: 'get'
    })
  },
  updateCourse(course) {
    return request({
      url: `/course/update`,
      method: 'put',
      data: course
    })
  },
  deleteCourseById(courseId) {
    return request({
      url: `/course/delete/${courseId}`,
      method: 'delete'
    })
  },
  deleteBatchByIds(courseIds) {
    return request({
      url: `/course/deleteBatch`,
      method: 'delete',
      data: courseIds
    })
  }
}
