const { isObject, def } = require('./utils')
const attachMethods = require('./array')
const arrayKeys = Object.getOwnPropertyNames(attachMethods)

class Observer {
  constructor (value, key, parent, path) {
    this.enumerable = true
    this.configurable = true
    
    this._key = key
    this._path = path || [key]
    this._value = value
    this._parent = parent
    this._isObservable = false
    this._watchers = new Set()
    this._children = new Set()
    this._shouldNotifyWhenDataChange = false
    let { get, set } = this
    this._parent && this._parent.childEntry(this)

    this.get = get.bind(this)
    this.set = set.bind(this)
    this.observe(value)
  }

  get () {
    return this._value
  }

  set (newVal) {
    console.log('[set value]', this._key, newVal)
    if (newVal === this._value || (isNaN(newVal) && isNaN(this._value))) {
      return
    }
    // 移除机制 todo
    this.notify('value:change')
    this.observe(newVal)
  }

  watch (watcher) {
    this._watchers.add(watcher)
    this.notify('watcher:registed')
  }

  unWatch (watcher) {
    this._watchers.delete(watcher)
  }

  childEntry (child) {
    this._children.add(child)

    if (this._shouldNotifyWhenDataChange || this._watchers.size) {
      // console.log('[child entry]', child._key)
      this.notifyChildWatcherEntry(child)
    }
  }

  childLeave (child) {
    this._children.delete(child)
  }

  notify (type, { path = [] } = {}) {
    if (type === 'watcher:registed') {
      for (const child of this._children) {
        this.notifyChildWatcherEntry(child)
      }
      return 
    }
    if (type === 'value:change') {
      path = this._path.concat(path)
      if (this._shouldNotifyWhenDataChange) {
        this._parent.notify('value:change', { path })
      }
      this._watchers.size && this.notifyWatcherDataChange({ path })
    }
  }

  notifyWatcherDataChange (params) {
    for (const watcher of this._watchers) {
      watcher.update(params)
    }
  }

  notifyChildWatcherEntry (child) {
    child._shouldNotifyWhenDataChange = true
    child.notify('watcher:registed')
  }

  observeArray (value) {
    for (let i = 0; i < value.length; i++) {
      let itemIndex = this._value.indexOf(value[i])
      console.log('==================')
      exports.defineReactive(this._value, itemIndex, value[i], { parent: this, path: [`[${itemIndex}]`] })
      console.log(this._value, this._key)
      this.notify('value:change', { path: [`[${itemIndex}]`] })
    }
  }

  attachArrayProps (value) {
    def(value, '__ob__', this)

    arrayKeys.forEach(key => {
      def(value, key, attachMethods[key])
    })

    return value
  }

  observe (value) {
    if (Array.isArray(value)) {
      return this.attachArrayProps(value) && this.observeArray(value)
    }

    if (!isObject(value)) return
    
    def(value, '__ob__', this)
    Object.keys(value).forEach(key => {
      if (typeof value[key] === 'function') return

      exports.defineReactive(value, key, value[key], { parent: this })
    })
  }
}

exports.defineReactive = function defineReactive (target, key, value, { watcher, parent, path } = {}) {
  let ob = value.__ob__
  let property = Object.getOwnPropertyDescriptor(target, key)
  if (property && property.configurable === false) {
    return
  }

  ob = ob || new Observer(value, key, parent, path)
  watcher && ob.watch(watcher)

  !ob._isObservable && Object.defineProperty(target, key, ob) && (ob._isObservable = true)

  return ob
}