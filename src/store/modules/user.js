import { login, logout, getInfo, register, improveInfo, page, ban, deleteUser, checkEmail, checkUsername, update, create } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 设置用户名
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 设置头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 设置权限
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // 删除用户
  deleteUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      deleteUser(userId).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, role } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户注册
  register({ commit }, userInfo) {
    const { username, email, password } = userInfo
    return new Promise((resolve, reject) => {
      register({ username: username.trim(), email: email, password: password }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 完善用户信息
  improveInfo({ commit }, userInfo) {
    const { username, age, gender } = userInfo
    return new Promise((resolve, reject) => {
      improveInfo({ username: username.trim(), age: age, gender: gender }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 查询用户信息
  page({ commit }, pageInfo) {
    const { pageNum, pageSize, username } = pageInfo
    return new Promise((resolve, reject) => {
      page(pageNum, pageSize, username).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 封解禁用户
  ban({ commit }, userId) {
    return new Promise((resolve, reject) => {
      ban(userId).then((response) => {
        resolve(response.data.user)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 检查用户名
  checkUsername({ commit }, username) {
    return new Promise((resovle, reject) => {
      checkUsername(username).then((response) => {
        resovle(response.data.isUsernameValid)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 检查邮箱
  checkEmail({ commit }, email) {
    return new Promise((resovle, reject) => {
      checkEmail(email).then((response) => {
        resovle(response.data.isEmailValid)
      }).catch(error => {
        reject(error)
      })
    })
  },
  update({ commit }, userInfo) {
    return new Promise((resovle, reject) => {
      update(userInfo).then((response) => {
        resovle(response.data.user)
      }).catch(error => {
        reject(error)
      })
    })
  },
  create({ commit }, userInfo) {
    return new Promise((resovle, reject) => {
      create(userInfo).then((response) => {
        resovle(response.data.user)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
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

