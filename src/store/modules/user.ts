import { reactive, ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import { resetRouter } from "@/router"
import { loginApi, getUserInfoApi, logoutApi } from "@/api/login"
import { type LoginRequestData } from "@/api/login/types/login"
import routeSettings from "@/config/route"
import {ElMessage, ElMessageBox} from "element-plus"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>("")
  const name = ref<string>("")
  const studentNumber = ref<string>("")
  const userId = ref<string>("")

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 登录 */
  const login = async ({ username, password }: LoginRequestData) => {
    const { data, code, msg } = await loginApi({ username, password })
    if(code === 800) {
      ElMessage.error(msg)
      return
    }
    ElMessage.success("登录成功")
    setToken(data.token)
    token.value = data.token
  }
  /** 获取用户详情 */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    data.roles = [data.roleName]
    userId.value = data.id
    username.value = data.username
    name.value = data.name
    studentNumber.value = data.studentNumber
    // 验证返回的 roles 是否为一个非空数组，否则塞入一个没有任何作用的默认角色，防止路由守卫逻辑进入无限循环
    roles.value = data.roles?.length > 0 ? data.roles : routeSettings.defaultRoles
  }
  /** 模拟角色变化 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    // 用刷新页面代替重新登录
    window.location.reload()
  }
  /** 登出 */
  const logout = async () => {
    const res = await logoutApi()
    if (res.code !== 200) {
      ElMessage.error("注销失败")
      return
    }
    ElMessage.success("退出成功")
    removeToken()
    resetState()
    resetRouter()
    _resetTagsView()
  }
  const resetState = () => {
    token.value = ""
    roles.value = []
    username.value = ""
    name.value = ""
    studentNumber.value = ""
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { userId, token, roles, username, name, studentNumber, login, getInfo, changeRoles, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
