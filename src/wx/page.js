import { nativePage } from './native'
import {merge, extendLife } from './merge'

const PAGE_LIFT_LIFE = [
  'onLoad',
  'onReady',
  'onShow',
  'onHide',
  'onUnload',
  'onPullDownRefresh',
  'onReachBottom',
  'onPageScroll',
  'onShareAppMessage',
  'onTabItemTap'
]

export default function (...pages) {
  let mergeFn = pages.pop()

  if (typeof mergeFn !== 'function') mergeFn = merge
  else pages.push(mergeFn)

  mergeFn = mergeFn(PAGE_LIFT_LIFE)

  let page = pages.reduce(mergeFn, {})

  PAGE_LIFT_LIFE.forEach(key => {
    let lifes = page[key]

    if (lifes && lifes.length) {
      page[key] = extendLife(lifes)
    }
  })
  nativePage(page)
}