import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import defineReactive from './observer';
import { parseKey, get } from '../utils';
var changeQ = [];

function minLenPath(paths) {
  var keys = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(paths), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var path = _step.value;

      if (!path) return [];
      if (/\.\[/.test(path)) path = path.replace(/\.\[/g, '[');
      keys.push(path);
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

  return keys;
}

var Watcher = function () {
  function Watcher(target, key, cb, ctx) {
    _classCallCheck(this, Watcher);

    var keys = parseKey(key);
    this.key = keys.pop();
    this.target = get(target, keys.join('.'));
    this.cb = ctx ? cb.bind(ctx) : cb;
    this._isWatching = true;

    console.log(this.target, this.key);
    this.ob = defineReactive(this.target, this.key, this.target[this.key], { watcher: this });
    // this.update()
  }

  _createClass(Watcher, [{
    key: 'update',
    value: function update() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$path = _ref.path,
          path = _ref$path === undefined ? [] : _ref$path;

      changeQ.push(path.join('.'));
      if (this.timer) return;
      this.timer = setTimeout(function () {
        _this.cb(_this._isWatching ? _this.target[_this.key] : _this.ob.tree(), changeQ);
        changeQ = [];
        _this.timer = null;
        console.log('[WATCH TREE]\n  ', _this.ob.tree());
      }, 0);
    }
  }, {
    key: 'unSubscribe',
    value: function unSubscribe() {
      this._isWatching = false;
      this.ob.unWatch(this);
    }
  }]);

  return Watcher;
}();

export default Watcher;