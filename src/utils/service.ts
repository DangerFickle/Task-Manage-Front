import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { get, merge } from "lodash-es"
import { getToken } from "./cache/cookies"
import { useUserStore } from "@/store/modules/user"
import router from "@/router"
/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
  useUserStoreHook().logout()
  location.reload()
}

/** 创建请求实例 */
function createService() {
  // 创建一个 axios 实例命名为 service
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => {
      if (getToken()) {
        config.headers["token"] = getToken()
      }
      return config
    },
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      const res = response.data

      if (res.code === 403) {
        // 用户权限不足
        ElMessage.error("用户权限不足")
        // return Promise.reject(new Error("用户权限不足123"))
        return Promise.reject("用户权限不足")
      }


      if (res.code === 401) {
        // 用户或密码错误，登陆失败
        ElMessage.error("用户或密码错误")
        return Promise.reject("用户或密码错误，登陆失败")
      }
      if (res.code === 806 || res.code === 809) {
        useUserStore().resetToken()
        // 登陆已过期
        router.push("/login").then(() => {
          ElMessage.error("登陆已过期，请重新登陆")
        })
        return Promise.reject("登陆已过期，请重新登陆")
      }
      if (res.code === 807) {
        useUserStore().resetToken()
        // Token未知错误
        router.push("/login").then(() => {
          ElMessage.error("Token未知错误，请重新登陆")
        })
        return Promise.reject("Token未知错误，请重新登陆")
      }

      // 用户被禁用
      if (res.code === 810) {
        useUserStore().resetToken()
        router.push("/login").then(() => {
          ElMessage.error(res.msg)
        })
        return Promise.reject("")
      }

      // 下载文件时判断登陆是否过期，后端在响应头里放上is_expired的值，如果没有这个值，说明没有过期
      if (response.headers["is_expired"] === "expired") {
        useUserStore().resetToken()
        // 提示用户之后再进行页面的刷新
        router.push("/login").then(() => {
          ElMessage.error("登陆已过期，请重新登陆")
        })
        return Promise.reject("登陆已过期，请重新登陆")
      }

      // 判断是否有文件下载，如果有，直接返回response给taskapi处理后续逻辑，不再返回res
      if (response.data instanceof Blob) {
        return response
      }

      return res
    },
    (error) => {
      // status 是 HTTP 状态码
      const status = get(error, "response.status")
      switch (status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          // Token 过期时
          logout()
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = "请求地址出错"
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP 版本不受支持"
          break
        default:
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return service
}

/** 创建请求方法 */
function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig): Promise<T> {
    const token = getToken()
    const defaultConfig = {
      headers: {
        // 携带 Token
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      },
      timeout: -1,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return service(mergeConfig)
  }
}

/** 用于网络请求的实例 */
const service = createService()
/** 用于网络请求的方法 */
export const request = createRequest(service)
