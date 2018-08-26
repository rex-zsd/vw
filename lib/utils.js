import _getIterator from 'babel-runtime/core-js/get-iterator';
import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _Object$defineProperty from 'babel-runtime/core-js/object/define-property';
import _typeof from 'babel-runtime/helpers/typeof';
import _Object$keys from 'babel-runtime/core-js/object/keys';
export var forEachValue = function forEachValue(obj, fn) {
  _Object$keys(obj).forEach(function (key) {
    return fn(obj[key], key);
  });
};

export var isObject = function isObject(obj) {
  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
};
export var isPromise = function isPromise(val) {
  return val && typeof val.then === 'function';
};

export var def = function def(obj, key, value) {
  _Object$defineProperty(obj, key, {
    enumerable: false,
    value: value
  });
};

export var isEmpty = function isEmpty(val) {
  return !val && val !== 0 || val === null || Array.isArray(val) && val.length === 0 || _JSON$stringify(val) === '{}';
};

export function parseKey(key) {
  var path = key.split(/[\.\[]/).map(function (key) {
    return key.replace(']', '');
  });

  return path;
}

export function get(target, key) {
  var res = target;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(parseKey(key)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var keyItem = _step.value;

      if (res && target) res = target[keyItem];else return undefined;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return res;
}