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
        type: 'error'
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

    // 判断是否有文件下载，如果有，直接返回response给taskapi处理后续逻辑，不再返回res
    if (response.data instanceof Blob) {
      return response
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
