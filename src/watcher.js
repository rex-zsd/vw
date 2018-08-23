const { defineReactive } = require('./observer')
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

module.exports = class Watcher {
  constructor (target, key, cb, ctx) {
    this.key = key
    this.target = target
    this.cb = cb.bind(ctx)
    this._isWatching = true
    this.ob = defineReactive(target, key, target[key], { watcher: this })
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