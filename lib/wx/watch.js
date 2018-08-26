import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import { extendLife } from './extend';

export default function () {
  var watch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var watchers = {};

  var _loop = function _loop(item) {
    _Object$keys(item).forEach(function (key) {
      var watcher = watchers[key] = watchers[key] || [];
      watcher.push(item[key]);
    });
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(watch), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      _loop(item);
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

  _Object$keys(watchers).forEach(function (key) {
    watchers[key] = extendLife(watchers[key]);
  });

  return watchers;
}