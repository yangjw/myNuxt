export const todoModule = {
  namespaced: true,

  state: () => ({
    todos: []
  }),

  getters: {
    getAllTodos: state => state.todos,
    getTodoCount: state => state.todos.length
  },

  mutations: {
    ADD_TODO(state, todo) {
      state.todos.push(todo)
    },
    REMOVE_TODO(state, todoId) {
      state.todos = state.todos.filter(todo => todo.id !== todoId)
    },
    UPDATE_TODO(state, { id, completed }) {
      const todo = state.todos.find(todo => todo.id === id)
      if (todo) {
        todo.completed = completed
      }
    }
  },

  actions: {
    addTodo({ commit }, todo) {
      commit('ADD_TODO', {
        id: Date.now(),
        text: todo,
        completed: false
      })
    },
    removeTodo({ commit }, todoId) {
      commit('REMOVE_TODO', todoId)
    },
    toggleTodo({ commit }, { id, completed }) {
      commit('UPDATE_TODO', { id, completed })
    }
  }
} 