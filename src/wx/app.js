import { mergeInstances, extendWatcher, extendLife } from './extend'
import { isEmpty } from '../utils'
import getWatchers from './watch'
import Store from '../vuex/store'
import { nativeApp } from './native'

const APP_LIFT_TIME = [
  'onLaunch',
  'onShow',
  'onHide',
  // 以下API应该采用覆盖的方式
  // 'onError',
  // 'onPageNotFound', 
]

export default function (...apps) {
  let app = mergeInstances(APP_LIFT_TIME, apps)
  let { store, watch } = app

  let watchers = watch ? getWatchers(watch) : []

  app.$store = new Store(store)
  app._watchers = []

  APP_LIFT_TIME.forEach(key => {
    let lifes = app[key]

    if (key === 'onLaunch') {
      !isEmpty(watchers) && lifes.unshift(
        extendWatcher(watchers)
      )
    }

    if(!(lifes && lifes.length)) return

    app[key] = extendLife(lifes)
  })
  nativeApp(app)
}