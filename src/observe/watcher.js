import defineReactive from './observer'
import { parseKey, get } from '../utils'
let changeQ = []

function minLenPath (paths) {
  let keys = []
  for (let path of paths) {
    if (!path) return []
    if (/\.\[/.test(path)) path = path.replace(/\.\[/g, '[')
    keys.push(path)
  }
  return keys
}

export default class Watcher {
  constructor (target, key, cb, ctx) {
    let keys = parseKey(key)
    this.key = keys.pop()
    this.target = get(target, keys.join('.'))
    this.cb = ctx ? cb.bind(ctx) : cb
    this._isWatching = true

    this.ob = defineReactive(this.target, this.key, this.target[this.key], { watcher: this })
    // this.update()
  }

  update ({ path = [] } = {}) {
    changeQ.push(path.join('.'))
    if (this.timer) return
    this.timer = setTimeout(() => {
      this.cb(this._isWatching ? this.target[this.key] : this.ob.tree(), changeQ)
      changeQ = []
      this.timer = null
      console.log('[WATCH TREE]\n  ', this.ob.tree())
    }, 0)
  }

  unSubscribe () {
    this._isWatching = false
    this.ob.unWatch(this)
  }
}