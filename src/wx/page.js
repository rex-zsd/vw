import { nativePage } from './native'
import { extendLife, mergeInstances, extendWatcher, extendStore, extendComputed } from './extend'
import { isEmpty, normalizeWatch } from '../utils'

const PAGE_LIFT_TIME = [
  'onLoad',
  'onReady',
  'onShow',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onPageScroll',
  // 'onShareAppMessage', 同一个PAGE不应该存在多个
  'onTabItemTap'
]



export default function (...pages) {
  let page = mergeInstances(PAGE_LIFT_TIME, pages)
  let {
    store,
    watch,
    computed,
    mapState,
    mapActions,
    mapGetters,
    mapMutations
  } = page

  let watchers = normalizeWatch(watch)

  PAGE_LIFT_TIME.forEach(key => {
    let lifes = page[key] || []

    if (key === 'onLoad') {
      !isEmpty(watchers) && lifes.unshift(extendWatcher(watchers))
      !isEmpty(computed) && lifes.unshift(extendComputed(computed))
      lifes.unshift(
        extendStore(
          store,
          mapState,
          mapActions,
          mapGetters,
          mapMutations
        )
      )
    }

    if (key === 'onUnload') {
       lifes.push(
        function onUnload () {
          !isEmpty(watchers) && this._watchers.forEach(watcher => watcher.unSubscribe())
          this._module && this.$store.uninstall(this._module)
        }
      )
    }

    page.store = null
    page.watch = null
    page.mapState = null
    page.mapGetters = null
    page.mapActions = null
    page.mapMutations = null
    
    if(!(lifes && lifes.length)) return

    page[key] = extendLife(lifes)
  })

  nativePage(page)
}