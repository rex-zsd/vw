import _Object$keys from 'babel-runtime/core-js/object/keys';
import Watcher from '../observe/watcher';
import Store from '../vuex/store';

var EXTEND_PROP = ['watch'];

export function extendLife(lifeFns) {
  return function () {
    var _this = this;

    var args = Array.prototype.slice.apply(arguments);
    lifeFns.forEach(function (lifeFn) {
      return lifeFn.apply(_this, args);
    });
  };
}

function merge(lifes) {
  return function (result, instance) {
    var keys = _Object$keys(instance);

    keys.forEach(function (key) {
      if (lifes.indexOf(key) !== -1 || EXTEND_PROP.indexOf(key) !== -1) {
        var lifeFns = result[key] = result[key] || [];
        lifeFns.push(instance[key]);
      } else {
        result[key] && console.error('重复定义了', key, '属性，将会丢失');
        result[key] = instance[key];
      }
    });

    return result;
  };
}

export function mergeInstances(instanceLifes, instances) {
  var mergeFn = instances.pop();

  if (typeof mergeFn !== 'function') {
    instances.push(mergeFn);
    mergeFn = merge;
  }

  mergeFn = mergeFn(instanceLifes);

  return instances.reduce(mergeFn, {});
}

export function extendWatcher(watchers) {
  return function watch() {
    var _this2 = this;

    this._watchers = [];
    console.log(watchers);
    _Object$keys(watchers).forEach(function (key) {
      _this2._watchers.push(new Watcher(_this2, key, watchers[key].bind(_this2)));
    });
  };
}

export function extendStore(store) {
  return function registerModule() {
    var app = getApp();
    var $store = app.$store || new Store({});

    this.$store = $store;
    this._module = $store.registerModule(store.name || this.is, store);
  };
}