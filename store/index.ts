import { createStore } from 'vuex'
import { todoModule } from './modules/todo'

export const store = createStore({
  state: () => ({
    counter: 0,
    user: null
  }),

  getters: {
    getCounter: state => state.counter,
    getUser: state => state.user
  },

  mutations: {
    INCREMENT(state) {
      state.counter++
    },
    DECREMENT(state) {
      state.counter--
    },
    SET_USER(state, user) {
      state.user = user
    }
  },

  actions: {
    increment({ commit }) {
      commit('INCREMENT')
    },
    decrement({ commit }) {
      commit('DECREMENT')
    },
    setUser({ commit }, user) {
      commit('SET_USER', user)
    }
  },

  modules: {
    todo: todoModule
  }
}) 