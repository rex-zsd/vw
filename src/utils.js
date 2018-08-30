export const forEachValue = (obj, fn) => {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export const isObject = function (obj) {
  return obj !== null && typeof obj === 'object'
}
export const isPromise = function isPromise (val) {
  return val && typeof val.then === 'function'
}


export const def = function (obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    value
  })
}

export const isEmpty = function (val) {
  return (!val && val !== 0) || val === null || (Array.isArray(val) && val.length === 0) || (typeof val === 'object' && Object.keys(val).length === 0)
}

export const noop = () => {}

export function parseKey (key) {
  let path = key.split(/[\.\[]/).map(key => key.replace(']', ''))
  
  return path
}

export function get (target, key) {
  let res = target
  for (const keyItem of parseKey(key)) {

    if (keyItem === '') return res

    if (res && res[keyItem]) {
      res = res[keyItem]
    }
    else return undefined
  }
  
  return res
}

export function debounce(fn, wait = 100, immediate){
  let timeout, args, context, timestamp, result;

  function later() {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = fn.apply(context, args);
        context = args = null;
      }
    }
  };

  return function() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = fn.apply(context, args);
      context = args = null;
    }

    return result;
  };
};
