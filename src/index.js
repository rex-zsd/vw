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

const store = new Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})

console.log(store.getters.doneTodos)