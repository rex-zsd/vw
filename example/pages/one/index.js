import { Page } from 'src/index'

const store = {
  namespaced: true,
  name: 'one',
  state: {
    step: 1
  },
  actions: {
    next ({commit}) {
      commit('NEXT')
    }
  },
  mutations: {
    NEXT (state) {
      state.step ++
    }
  }
}
Page({
  store,
  
  mapState: {
    one: []
  },

  watch: {
    '$store.state.step' (value, keys) {
      console.log(value, keys)
    }
  },

  onLoad() {
    this.$store.dispatch('one/next')
    // console.log(this.$store)
  }
})