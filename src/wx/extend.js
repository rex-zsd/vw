import Watcher from '../observe/watcher'
import Store from '../vuex/store'
import { mapState, mapGetters, mapMutations, mapActions } from '../vuex/helper'
import { debounce, noop } from '../utils'

const EXTEND_PROP = [
  'watch'
]

export function extendLife (lifeFns) {
  return function () {
    let args = Array.prototype.slice.apply(arguments)
    lifeFns.forEach(lifeFn => lifeFn.apply(this, args))
  }
}

function merge (lifes) {
  return function (result, instance) {
    let keys = Object.keys(instance)

    keys.forEach((key) => {
      if (lifes.indexOf(key) !== -1 || EXTEND_PROP.indexOf(key) !== -1) {
        const lifeFns = result[key] = result[key] || []
        lifeFns.push(instance[key])
      } else {
        result[key] && console.error('重复定义了', key, '属性，将会丢失')
        result[key] = instance[key]
      }
    })

    return result
  }
}


export function mergeInstances (instanceLifes, instances) {
  let mergeFn = instances.pop()

  if (typeof mergeFn !== 'function') {
    instances.push(mergeFn)
    mergeFn = merge
  }

  mergeFn = mergeFn(instanceLifes)

  return instances.reduce(mergeFn, {})
}

export function extendWatcher (watchers) {
  return function watch () {
    this._watchers = []
    Object.keys(watchers).forEach(key => {
      this._watchers.push(
        new Watcher(this, key, watchers[key].bind(this))
      )
    })
  }
}

export function extendComputed (computedProps) {
  return function computed () {
    let props = Object.keys(computedProps)

    props.forEach(key => {
      let get = (computedProps[key].get || computedProps[key]).bind(this)
      let set = (computedProps[key].set || noop).bind(this)

      const onUpdated = () => {
        resolveChanges(this, key, get)
      }

      new Watcher(this, key, onUpdated.bind(this), {
        get,
        set,
        computed: true
      })
    })
  }
}

export function extendStore (
  store,
  mapState,
  mapActions,
  mapGetters,
  mapMutations
) {
  return function registerModule () {
    let app = getApp()
    let $store = app.$store || new Store({})

    this.$store = $store
    this._module = $store.registerModule([store.name || this.is], store)

    mapState && mapStateToInstance(this, $store, mapState)
    mapActions && mapActionsToInstance(this, $store, mapActions)
    mapGetters && mapGettersToInstance(this, $store, mapGetters)
    mapMutations && mapMutationsToInstance(this, $store, mapMutations)
  }
}

function mapStateToInstance (ctx, store, states, type) {
  Object.keys(states).forEach(namespace => {
    const mappedState = mapState(namespace, states[namespace])
    const module = store.getModule([namespace])
    states[namespace].forEach(key => {
      ctx[key] = module.context.state[key]
      new Watcher(module.context.state, key, () => {
        resolveChanges(ctx, key, mappedState[key])
      })
    })
  })
}

function mapGettersToInstance(ctx, store, getters, type) {
  Object.keys(getters).forEach(namespace => {
    const mappedGetters = mapGetters(namespace, getters[namespace])

    getters[namespace].forEach(key => {
      const get = mappedGetters[key].bind(ctx)
      const updated = () => {
        resolveChanges(ctx, key, get)
      }

      new Watcher(ctx, key, updated.bind(ctx), {
        computed: true,
        get
      })
    })
  })
}

function mapActionsToInstance (ctx, store, actions, type) {
  Object.keys(actions).forEach(namespace => {
    const mappedActions = mapActions(namespace, actions[namespace])
    Object.keys(mappedActions).forEach(key => {
      ctx[key] = mappedActions[key].bind(ctx)
    })
  })
}

function mapMutationsToInstance (ctx, store, mutations, type) {
  Object.keys(mutations).forEach(namespace => {
    const mappedMutations = mapMutations(namespace, mutations[namespace])
    Object.keys(mappedMutations).forEach(key => {
      ctx[key] = mappedMutations[key].bind(ctx)
    })
  })
}

function resolveChanges(ctx, key, getValue) {
  ctx.__storeChanges = ctx.__storeChanges || []
  ctx.__storeChanges.push({ key, getValue })
  patch(ctx)
}

const patch = debounce((ctx) => {
  const changes = ctx.__storeChanges || []
  const data = changes.reduce((prev, item) => {
    prev[item.key] = item.getValue.call(ctx)
    return prev
  }, {})
  ctx.setData(data)
  ctx.__storeChanges = [];
}, 100)