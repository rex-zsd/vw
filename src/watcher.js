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
    this.cb = cb.bind(ctx)
    this.target = target
    this.key = key
    defineReactive(target, key, target[key], { watcher: this })
    // this.update()
  }

  update ({ path = [] } = {}) {
    changeQ.push(path.join('.'))
    if (this.timer) return
    this.timer = setTimeout(() => {
      console.log(minLenPath(changeQ), '========')
      this.cb(this.target[this.key], changeQ)
      changeQ = []
      this.timer = null
    }, 0)
  }
}