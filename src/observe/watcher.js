import defineReactive from './observer'
import { parseKey, get, noop } from '../utils'
let changeQ = []

function minLenPath (paths) {
  paths.sort((a, b) => a.length > b.length)
  
  let keys = []
  let path = paths.shift()
  
  if (!path) return ['']

  keys.push(path)

  let waitPaths = [...paths]

  let pathReg = path.replace(/[\.\[\]]/g, ($1) => {
    return `\\${$1}`
  })

  let reg = new RegExp(`^${pathReg}[\\.\\[]`)
  
  let nextWait = []
  for (let i = 0; i < waitPaths.length; i++) {
    if (!reg.test(waitPaths[i])) {
      nextWait.push(waitPaths[i])
    }
  }

  nextWait.length && (keys = keys.concat(minLenPath(nextWait)))

  return keys
}

export default class Watcher {
  constructor (
    target,
    key,
    cb = noop,
    {
      ctx, reactive
    } = {}
  ) {
    let keys = parseKey(key)

    this.key = keys.pop()
    this.target = keys.length > 0 ? get(target, keys.join('.')) : target

    this.cb = ctx ? cb.bind(ctx) : cb
    this._isWatching = true
    this._reactive = reactive || true
    this._ctx = ctx

    console.log(this.target, target)

    this.ob = defineReactive(this.target, this.key, this.target[this.key], { watcher: this })
    console.log(this.target, target)

    this.update()
  }

  update ({ path = [] } = {}) {
    changeQ.push(path.join('.').replace(/\.\[/g, '['))
    if (this.timer) return
    this.timer = setTimeout(() => {
      let changeKeys = minLenPath(changeQ)

      this.cb(
        this._isWatching ? this.target[this.key] : this.ob.tree(),
        changeKeys,
        this._reactive && this.autoSetData(changeKeys)
      )

      changeQ = []
      this.timer = null
      console.log('[WATCH TREE]\n  ', this.ob.tree())
    }, 0)
  }

  autoSetData (keys) {
    let updateData = {}
    for (const key of keys) {
      updateData[key] = get(this.target, key)
    }

    this._ctx && typeof this._ctx.setData === 'function' && this._ctx.setData(updateData)
  }

  unSubscribe () {
    this._isWatching = false
    this.ob.unWatch(this)
  }
}