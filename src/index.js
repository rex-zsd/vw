import App from './wx/app'
import Page from './wx/page'
// import Store from './vuex/store'
// import Watcher from './observe/watcher'
// import defineReactive from './observe/observer'

export { App, Page }

// const store = new Store({
//   state: {
//     todos: [
//       { id: 1, text: '...', done: true },
//       { id: 2, text: '...', done: false }
//     ]
//   },
//   actions: {
//     setTwoBeDone ({commit}) {
//       commit('TWO_DONE')
//     },
//     pushOneToList({commit}) {
//       commit('PUST_ONE', { id: 3, done: false })
//     }
//   },
//   mutations: {
//     TWO_DONE(state) {
//       state.todos[1].done = true
//     },
//     PUST_ONE(state, payload) {
//       state.todos.push(payload)
//     }
//   },
//   getters: {
//     doneTodos: state => {
//       return state.todos.filter(todo => todo.done)
//     }
//   }
// }, defineReactive)




// // store.state.todos.push(1)
// store.dispatch('setTwoBeDone')

// let watcher = new Watcher(store.state, 'todos', (todos, keys) => {
//   console.log('[RESULT VALUE]\n  ', todos)
//   console.log('[RESULT KEYS]\n  ', keys)

//   console.log('[DONE TODO]', store.getters.doneTodos)
// })

// setTimeout(() => {
//   store.state.todos[1] = { id: 1 }
//   watcher.unSubscribe()
//   store.state.todos[1] = {}
// }, 300)

// store.dispatch('pushOneToList')

// store.state.todos[1] = {id: 4}
// store.state.todos[2].done = false

// setTimeout(() => {
//   store.state.todos[2].id = '-1'
//   store.state.todos[2].done = true
//   store.state.todos[2] = {}
//   store.state.todos[1].id = 5
// }, 200)