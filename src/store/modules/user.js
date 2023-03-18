import userApi from '@/api/user'
import { Message } from 'element-ui'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    studentNumber: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_STUDENT_NUMBER: (state, studentNumber) => {
    state.studentNumber = studentNumber
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      userApi.login({ username: username.trim(), password: password })
        .then(response => {
          if (response.code === 800) {
            Message({
              message: response.msg,
              type: 'error'
            })
            reject()
            return
          }
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          Message({
            message: response.msg,
            type: 'success'
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      userApi.getUserInfo().then(response => {
        const { data } = response
        const { name, avatar, studentNumber } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_STUDENT_NUMBER', studentNumber)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //
  // // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      userApi.logout().then(() => {
        removeToken() // 必须先删除令牌
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 必须先删除令牌
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

