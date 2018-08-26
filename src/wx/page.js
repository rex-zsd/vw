import { nativePage } from './native'
import { extendLife, mergeInstances, extendWatcher, extendStore } from './extend'
import getWatchers from './watch'
import Store from '../vuex/store'
import { isEmpty } from '../utils'

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
  pages.unshift({
    onLoad () {

    },

    onUnload() {}
  })
  let page = mergeInstances(PAGE_LIFT_TIME, pages)
  let { store, watch } = page
  let watchers = getWatchers(watch)

  PAGE_LIFT_TIME.forEach(key => {
    let lifes = page[key]

    if (key === 'onLoad') {
      !isEmpty(watchers) && lifes.unshift(extendWatcher(watchers))
      !isEmpty(store) && lifes.unshift(extendStore(store))
    }

    if (key === 'onUnload') {
       lifes.push(
        function onUnload () {
          !isEmpty(watchers) && this._watchers.forEach(watcher => watcher.unSubscribe())
          this._module && this.$store.uninstall(this._module)
        }
      )
    }
    
    if(!(lifes && lifes.length)) return

    page[key] = extendLife(lifes)
  })

  nativePage(page)
}