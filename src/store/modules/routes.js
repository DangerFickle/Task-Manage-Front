import { exclusiveRoute, constantRoutes } from '@/router'
function hasPermission(roleName, router) {
  if (router.meta && router.meta.role) {
    let flag = false
    router.meta.role.forEach(routeRoleName => {
      if (routeRoleName === roleName) {
        flag = true
        return flag
      }
    })
    return flag
  } else {
    return true
  }
}

const state = {
  addRouters: []
}

const actions = {
  generateRoutes({ commit }, data) {
    const { roleName } = data
    const addRouters = exclusiveRoute.filter(router => {
      if (hasPermission(roleName, router)) {
        if (router.children && router.children.length > 0) {
          router.children = router.children.filter(child => {
            if (hasPermission(roleName, child)) {
              return child
            }
            return false
          })
          return router
        } else {
          return router
        }
      }
      return false
    })
    commit('ADDROUTES', addRouters)
  }
}

const mutations = {
  ADDROUTES(state, addRouters) {
    state.addRouters = addRouters
  }
}

const getters = {
  addRouters() {
    return state.addRouters
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
