import _Object$defineProperty from 'babel-runtime/core-js/object/define-property';
import _Object$getOwnPropertyDescriptor from 'babel-runtime/core-js/object/get-own-property-descriptor';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Set from 'babel-runtime/core-js/set';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _Object$getOwnPropertyNames from 'babel-runtime/core-js/object/get-own-property-names';

var _require = require('../utils'),
    isObject = _require.isObject,
    def = _require.def,
    isEmpty = _require.isEmpty;

var attachMethods = require('./array');
var arrayKeys = _Object$getOwnPropertyNames(attachMethods);

var Observer = function () {
  function Observer(value, key, parent, path) {
    _classCallCheck(this, Observer);

    this.enumerable = true;
    this.configurable = true;

    this._key = key;
    this._path = path || [key];
    this._value = value;
    this._parent = parent;
    this._isObservable = false;
    this._watchers = new _Set();
    this._children = new _Set();
    this._shouldNotifyWhenDataChange = false;
    var get = this.get,
        set = this.set;

    this._parent && this._parent.childEntry(this);

    this.get = get.bind(this);
    this.set = set.bind(this);
    this.observe(value);
  }

  _createClass(Observer, [{
    key: 'get',
    value: function get() {
      return this._value;
    }
  }, {
    key: 'set',
    value: function set(newVal) {
      console.log('[SET VALUE]', this._value, newVal);

      if (newVal === this._value || newVal !== this._value && newVal !== newVal) {
        return;
      }
      this.notify('value:change');
      this.observe(newVal);
    }
  }, {
    key: 'watch',
    value: function watch(watcher) {
      this._watchers.add(watcher);
      this.notify('watcher:registed', true);
      console.log('[WATCHER ENTRY]');
    }
  }, {
    key: 'unWatch',
    value: function unWatch(watcher) {
      this._watchers.delete(watcher);

      if (!this._shouldNotifyWhenDataChange && !this._watchers.size) {
        this.notify('watcher:registed', false);
      }
      console.log('[WATCHER LEAVE]');
    }
  }, {
    key: 'childEntry',
    value: function childEntry(child) {
      this._children.add(child);

      if (this._shouldNotifyWhenDataChange || this._watchers.size) {
        this.notifyChildWatcherEntry(child, true);
      }
    }
  }, {
    key: 'childLeave',
    value: function childLeave(child) {
      this._children.delete(child);
    }
  }, {
    key: 'notify',
    value: function notify(type) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$path = _ref.path,
          path = _ref$path === undefined ? [] : _ref$path,
          watch = _ref.watch;

      if (type === 'watcher:registed') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _getIterator(this._children), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var child = _step.value;

            this.notifyChildWatcherEntry(child, watch);
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

        return;
      }
      if (type === 'value:change') {
        path = this._path.concat(path);
        if (this._shouldNotifyWhenDataChange) {
          this._parent.notify('value:change', { path: path });
        }
        this._watchers.size && this.notifyWatcherDataChange({ path: path });
      }
    }
  }, {
    key: 'notifyWatcherDataChange',
    value: function notifyWatcherDataChange(params) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(this._watchers), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var watcher = _step2.value;

          watcher.update(params);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'notifyChildWatcherEntry',
    value: function notifyChildWatcherEntry(child, should) {
      child._shouldNotifyWhenDataChange = should;
      child.notify('watcher:registed');
    }
  }, {
    key: 'observeArray',
    value: function observeArray(value) {
      for (var i = 0; i < value.length; i++) {
        var itemIndex = this._value.indexOf(value[i]);
        exports.defineReactive(this._value, itemIndex, value[i], { parent: this, path: ['[' + itemIndex + ']'] });
        this.notify('value:change', { path: ['[' + itemIndex + ']'] });
      }
    }
  }, {
    key: 'attachArrayProps',
    value: function attachArrayProps(value) {
      def(value, '__ob__', this);

      arrayKeys.forEach(function (key) {
        def(value, key, attachMethods[key]);
      });

      return value;
    }
  }, {
    key: 'clearChildren',
    value: function clearChildren() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _getIterator(this._children), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var child = _step3.value;

          this.childLeave(child);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      console.log('[CLEAR CHILDREN]', this._value);
    }
  }, {
    key: 'observe',
    value: function observe(value) {
      var _this = this;

      if (Array.isArray(value)) {
        this.attachArrayProps(value) && this.observeArray(value);
        return this._value = value;
      }

      if (!isObject(value) || isEmpty(value)) {
        this._children.size && this.clearChildren();
        return this._value = value;
      }

      def(value, '__ob__', this);
      _Object$keys(value).forEach(function (key) {
        if (typeof value[key] === 'function') return;

        exports.defineReactive(value, key, value[key], { parent: _this });
      });

      this._value = value;
    }
  }, {
    key: 'tree',
    value: function tree() {
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      root[this._key] = this._children.size ? {} : this._value;

      if (Array.isArray(this._value)) root[this._key] = [];

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _getIterator(this._children), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var child = _step4.value;

          child.tree(root[this._key]);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return root;
    }
  }]);

  return Observer;
}();

function defineReactive(target, key, value) {
  var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      watcher = _ref2.watcher,
      parent = _ref2.parent,
      path = _ref2.path;

  var ob = value.__ob__;
  var property = _Object$getOwnPropertyDescriptor(target, key);
  if (property && property.configurable === false) {
    return;
  }

  ob = ob || new Observer(value, key, parent, path);
  watcher && ob.watch(watcher);

  !ob._isObservable && _Object$defineProperty(target, key, ob) && (ob._isObservable = true);

  return ob;
}

export default defineReactive;