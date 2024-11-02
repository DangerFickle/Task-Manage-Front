import { request } from "@/utils/service"
import type * as Login from "./types/login"
import { User } from "@/api/user/types/user"
import { ApiResponse } from "../../../types/api"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<ApiResponse<null>>({
    url: "login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
// export function loginApi(data: Login.LoginRequestData) {
//   return request<Login.LoginResponseData>({
//     url: "users/login",
//     method: "post",
//     data
//   })
// }

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<ApiResponse<User>>({
    url: "user/info",
    method: "get"
  })
}

export function loginApi(user: User) {
  return request<ApiResponse<{ token: string }>>({
    url: "/user/login",
    method: "post",
    data: user
  })
}

export function logoutApi() {
  return request<ApiResponse<null>>({
    url: "/user/logout",
    method: "get"
  })
}
