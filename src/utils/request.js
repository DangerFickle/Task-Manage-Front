import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken, removeToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送 Cookie
  timeout: 0 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['X-Token'] 是自定义标头键
      // 请根据实际情况修改
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (res.code === 403) { // 用户权限不足
      Message({
        // message: res.msg || 'Error',
        message: '用户权限不足',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(new Error('用户权限不足'))
    }
    if (res.code === 401) { // 用户或密码错误，登陆失败
      Message({
        // message: res.msg || 'Error',
        message: '用户或密码错误',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(new Error('用户或密码错误，登陆失败'))
    }
    if (res.code === 806 || res.code === 809) { // 登陆已过期
      MessageBox.confirm('登陆已过期，请重新登陆', '重新登陆', {
        confirmButtonText: '重新登陆',
        showCancelButton: false,
        type: 'error',
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error('登陆已过期，请重新登陆'))
    }
    if (res.code === 807) { // Token未知错误
      MessageBox.confirm('Token未知错误，请重新登陆', '重新登陆', {
        confirmButtonText: '重新登陆',
        showCancelButton: false,
        type: 'error'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error('Token未知错误，请重新登陆'))
    }

    // 下载文件时判断登陆是否过期，后端在响应头里放上is_expired的值，如果没有这个值，说明没有过期
    if (response.headers['is_expired'] === 'expired') {
      // 提示用户之后再进行页面的刷新
      MessageBox.confirm('登陆已过期，请重新登陆', '重新登陆', {
        confirmButtonText: '重新登陆',
        showCancelButton: false,
        type: 'error'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error('登陆已过期，请重新登陆'))
    }

    // 检查下载文件时是否有后端传来的异常信息
    if (response.headers['exception']) {
      let msg = response.headers['exception']
      if (msg === 'batch not exist') {
        msg = '批次不存在'
      } else if (msg === 'batch not end') {
        msg = '该批次还未截止，无法下载'
      } else if (msg === 'course is disabled') {
        msg = '所属课程已被禁用，无法下载'
      } else if (msg === 'no task') {
        msg = '该批次下还没有作业'
      } else if (msg === 'batch folder not exist') {
        msg = '该批次文件夹不存在'
      } else {
        msg = ''
      }

      if (msg !== '') {
        Message({
          message: msg,
          type: 'error',
          duration: 5 * 1000
        })
        return res
      }
    }

    // 判断是否有文件下载
    const respContentType = response.headers['content-type']
    if (respContentType === 'application/octet-stream;charset=UTF-8') {
      // 由于后台返回文件名称是通过response返回的
      // 因此需要从response headers中content-disposition响应头中获取文件名称fileName
      let fileName = response.headers['content-disposition']
      fileName = fileName.split('=')[1]
      const url = window.URL.createObjectURL(new Blob([res], {
        type: 'application/octet-stream;charset=UTF-8'
      }))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      // decodeURIComponent解决文件名的url转码问题
      link.setAttribute('download', decodeURIComponent(fileName))
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    return res

  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
