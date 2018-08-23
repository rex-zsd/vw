// import {nativeApp, nativePage} from './global'
// import merge from './merge'
// class Store {

// }

// function application (app) {
//   let store = app.store || {}
//   app.$store = new Store(store)
//   nativeApp(app)
// }

// function page (...rest) {
//   let initPage = {
//     onLoad (options) {

//     },
//     onShow () {

//     }
//   }
  
//   let page = merge(initPage, ...rest)
//   nativePage(page)
// }

// export const App = application
// export const Page = page
const Store = require('./store')
const Watcher = require('./watcher')
const { defineReactive } = require('./observer')

const store = new Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  actions: {
    setTwoBeDone ({commit}) {
      commit('TWO_DONE')
    },
    pushOneToList({commit}) {
      commit('PUST_ONE', { id: 3, done: false })
    }
  },
  mutations: {
    TWO_DONE(state) {
      state.todos[1].done = true
    },
    PUST_ONE(state, payload) {
      state.todos.push(payload)
    }
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
}, defineReactive)




// store.state.todos.push(1)
store.dispatch('setTwoBeDone')

let watcher = new Watcher(store.state, 'todos', (todos, keys) => {
  console.log('[RESULT VALUE]\n  ', todos)
  console.log('[RESULT KEYS]\n  ', keys)

  console.log('[DONE TODO]', store.getters.doneTodos)
})

setTimeout(() => {
  store.state.todos[1] = { id: 1 }
  watcher.unSubscribe()
  store.state.todos[1] = {}
}, 300)

store.dispatch('pushOneToList')

store.state.todos[1] = 2
store.state.todos[2].done = false

setTimeout(() => {
  store.state.todos[2].id = '-1'
  store.state.todos[2].done = true
  store.state.todos[2] = {}
}, 200)