import { App } from 'src/index'

App({
  store: {
    state: {
      test: 'a'
    }
  },

  watch: {
    '$store.state.test' (value, key) {
      console.log(value, key)
    }
  },

  onLaunch () {
    console.log(this.$store.state)
    this.$store.state.test = 4
  }
})