import { extendLife } from './extend'

export default function (watch = []) {
  let watchers = {}

  for (const item of watch) {
    Object.keys(item).forEach(key => {
      let watcher = watchers[key] = watchers[key] || []
      watcher.push(item[key])
    })
  }

  Object.keys(watchers).forEach(key => {
    watchers[key] = extendLife(watchers[key])
  })

  return watchers
}