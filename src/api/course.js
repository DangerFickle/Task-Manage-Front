import request from '@/utils/request'

const apiHost = 'http://taskapi.belongme.top'

export default {
  getCourseListPage(searchCourse, page, pageSize) {
    return request({
      url: `${apiHost}/course/listPage/${page}/${pageSize}`,
      method: 'get',
      params: searchCourse
    })
  },
  getCourseListOnlyEnabled() {
    return request({
      url: `${apiHost}/course/listOnlyEnabled`,
      method: 'get'
    })
  },
  updateStatus(id, status) {
    return request({
      // 接口路径
      url: `${apiHost}/course/updateStatus/${id}/${status}`,
      method: 'put' // 提交方式
    })
  },
  addCourse(course) {
    return request({
      url: `${apiHost}/course/add`,
      method: 'post',
      data: course
    })
  },
  getCourseById(id) {
    return request({
      url: `${apiHost}/course/get/${id}`,
      method: 'get'
    })
  },
  updateCourse(course) {
    return request({
      url: `${apiHost}/course/update`,
      method: 'put',
      data: course
    })
  },
  deleteCourseById(courseId) {
    return request({
      url: `${apiHost}/course/delete/${courseId}`,
      method: 'delete'
    })
  },
  deleteBatchByIds(courseIds) {
    return request({
      url: `${apiHost}/course/deleteBatch`,
      method: 'delete',
      data: courseIds
    })
  }
}
