import defineReactive from './observer'
import Dep from './dep'
import { parseKey, get, noop, isObject } from '../utils'

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
    options = {}
  ) {
    let keys = parseKey(key)
    this.key = keys.pop()
    this.target = keys.length > 0 ? get(target, keys.join('.')) : target

    this.cb = cb
    this.options = options
    this._isWatching = true
    this._value = this.target[this.key]
    this._changeQ = []

    if (this.options.computed) {
      return this.defineComputed({
        get: options.get,
        set: options.set,
        cb
      })
    }

    if (!this.target || !isObject(this.target)) {
      return console.error('监听对象必须是一个类型为 object 的变量')
    }

    this.ob = defineReactive(this.target, this.key, this.target[this.key], { watcher: this })

    this.update()
  }

  update ({ path = [] } = {}) {
    this._changeQ.push(path.join('.').replace(/\.\[/g, '['))
    if (this.timer) return
    this.timer = setTimeout(() => {
      let changeKeys = minLenPath(this._changeQ)

      this.cb(
        this._isWatching ? this.target[this.key] : this.ob.tree(),
        changeKeys
      )

      this._changeQ = []
      this.timer = null
      console.log('[WATCH TREE]\n  ', this.ob.tree())
    }, 0)
  }

  defineComputed ({ set, get, cb }) {
    const onDepUpdated = () => {
      const val = get()
      cb(val)
    }
    Object.defineProperty(this.target, this.key, {
      get () {
        Dep.target = onDepUpdated

        const val = get()

        Dep.target = null
        return val
      },

      set
    })

    cb(this.target[this.key])
  }

  unSubscribe () {
    this._isWatching = false
    this.ob.unWatch(this)
  }
}