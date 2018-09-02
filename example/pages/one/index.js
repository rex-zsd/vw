import { Page } from 'src/index'

const store = {
  namespaced: true,
  name: 'one',
  state: {
    step: 1,
    fuu: [1, 2, 3]
  },
  getters: {
    momo(state) {
      return state.step + 2
    },
    rank(state) {
      return state.fuu
    },
    doneTodos: state => {
      return state.fuu.filter(todo => todo === 1)
    }
  },
  actions: {
    next ({commit}) {
      commit('NEXT')
    }
  },
  mutations: {
    NEXT (state) {
      state.step ++
    },
    MOCK (state, payload) {
      state.fuu.push(payload)
    }
  }
}
Page({
  store,
  
  mapState: {
    one: ['step', 'fuu']
  },

  mapGetters: {
    one: ['momo', 'doneTodos']
  },

  mapActions: {
    one: {
      nextAction: 'next'
    }
  },

  mapMutations: {
    one: ['NEXT', 'MOCK']
  },

  computed: {
    canGet () {
      return this.step + this.fuu.length
    }
  },

  watch: {
    // 'step' (value, keys) {
    //   console.log(value, keys)
    // }
  },

  onLoad() {
    setTimeout(() => this.nextAction(), 200)
    console.log(this.canGet)
  }
})