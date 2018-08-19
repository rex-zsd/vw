/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

const { def } = require('./utils')

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */
;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }

    return result
  })

})

module.exports = arrayMethods