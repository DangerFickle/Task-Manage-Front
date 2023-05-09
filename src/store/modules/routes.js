import { exclusiveRoute, constantRoutes } from '@/router'

function hasPermission(roleName, route) {
  let flag = false
  if (route.meta && route.meta.role) {
    route.meta.role.forEach(routeRoleName => {
      if (routeRoleName === roleName) {
        flag = true
      }
    })
  }
  return flag
}

const state = {
  addRouters: []
}

const actions = {
  generateRoutes({ commit }, data) {
    const { roleName } = data

    const addRouters = []

    exclusiveRoute.forEach(route => {
      const oldChildren = route.children
      const newChildren = []
      if (oldChildren && oldChildren.length > 0) {

        oldChildren.forEach(child => {
          if (hasPermission(roleName, child)) {
            newChildren.push(child)
          }
        })
        if (newChildren.length !== 0) {
          route.children = newChildren
          addRouters.push(route)
        }
      }
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
