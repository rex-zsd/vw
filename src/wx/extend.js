import Watcher from '../observe/watcher'
import Store from '../vuex/store'

const EXTEND_PROP = [
  'watch',
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

    mapState && mapStateToInstance(this, store, mapState)
    mapActions && mapActionsToInstance(this, store, mapActions)
    mapGetters && mapGettersToInstance(this, store, mapGetters)
    mapMutations && mapMutationsToInstance(this, store, mapMutations)
  }
}


function mapStateToInstance (ctx, store, mapState, type) {

}