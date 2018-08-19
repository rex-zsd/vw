module.exports.forEachValue = (obj, fn) => {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

module.exports.isObject = function (obj) {
  return obj !== null && typeof obj === 'object'
}
module.exports.isPromise = function isPromise (val) {
  return val && typeof val.then === 'function'
}


module.exports.def = function (obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    value
  })
}