import _typeof from 'babel-runtime/helpers/typeof';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _Object$defineProperties from 'babel-runtime/core-js/object/define-properties';
import _Object$defineProperty from 'babel-runtime/core-js/object/define-property';
import _Promise from 'babel-runtime/core-js/promise';
import _Object$create from 'babel-runtime/core-js/object/create';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import { forEachValue, isObject, isPromise } from '../utils';
import Module from './module';

var Store = function () {
  function Store(module, defineReactive) {
    _classCallCheck(this, Store);

    this._committing = false;
    this._actions = _Object$create(null);
    this._actionSubscribers = [];
    this._mutations = _Object$create(null);
    this._wrappedGetters = _Object$create(null);
    this._subscribers = [];
    this._defineReactive = defineReactive;

    var store = this;
    var dispatch = this.dispatch,
        commit = this.commit;

    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };
    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options);
    };

    this.registerModule([], module);
    this.computedGetters();
  }

  _createClass(Store, [{
    key: 'commit',
    value: function commit(_type, _payload, _options) {
      var _this = this;

      // check object-style commit
      var _unifyObjectStyle = unifyObjectStyle(_type, _payload, _options),
          type = _unifyObjectStyle.type,
          payload = _unifyObjectStyle.payload,
          options = _unifyObjectStyle.options;

      var mutation = { type: type, payload: payload };
      var entry = this._mutations[type];
      if (!entry) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[vuex] unknown mutation type: ' + type);
        }
        return;
      }
      this._withCommit(function () {
        entry.forEach(function commitIterator(handler) {
          handler(payload);
        });
      });
      this._subscribers.forEach(function (sub) {
        return sub(mutation, _this.state);
      });

      if (process.env.NODE_ENV !== 'production' && options && options.silent) {
        console.warn('[vuex] mutation type: ' + type + '. Silent option has been removed. ' + 'Use the filter functionality in the vue-devtools');
      }
    }
  }, {
    key: 'dispatch',
    value: function dispatch(_type, _payload) {
      var _this2 = this;

      // check object-style dispatch
      var _unifyObjectStyle2 = unifyObjectStyle(_type, _payload),
          type = _unifyObjectStyle2.type,
          payload = _unifyObjectStyle2.payload;

      var action = { type: type, payload: payload };
      var entry = this._actions[type];
      if (!entry) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[vuex] unknown action type: ' + type);
        }
        return;
      }

      this._actionSubscribers.forEach(function (sub) {
        return sub(action, _this2.state);
      });

      return entry.length > 1 ? _Promise.all(entry.map(function (handler) {
        return handler(payload);
      })) : entry[0](payload);
    }
  }, {
    key: 'getModule',
    value: function getModule(path) {
      return path.reduce(function (module, key) {
        return module.getChild(key);
      }, this.root);
    }
  }, {
    key: 'registerModule',
    value: function registerModule(path, module) {
      var _this3 = this;

      var newModule = new Module(module, this._defineReactive, path);

      if (!path.length) {
        this.root = newModule;
      } else {
        var parent = this.getModule(path.slice(0, -1));
        parent.addChild(path[path.length - 1], newModule);
      }

      if (module.modules) {
        forEachValue(module.modules, function (child, key) {
          _this3.registerModule(path.concat(key), child);
        });
      }

      installModule(this, path, newModule);

      return newModule;
    }
  }, {
    key: 'computedGetters',
    value: function computedGetters() {
      var _this4 = this;

      this.getters = {};
      var wrappedGetters = this._wrappedGetters;
      var computed = {};

      forEachValue(wrappedGetters, function (fn, key) {
        // use computed to leverage its lazy-caching mechanism
        // computed[key] = () => fn(this)
        _Object$defineProperty(_this4.getters, key, {
          get: function get() {
            return fn(_this4);
          },
          enumerable: true // for local getters
        });
      });

      // new Watcher(computed, store)
    }
  }, {
    key: '_withCommit',
    value: function _withCommit(fn) {
      var committing = this._committing;
      this._committing = true;
      fn();
      this._committing = committing;
    }
  }, {
    key: '_getNamespace',
    value: function _getNamespace(path) {
      var module = this.root;
      return path.reduce(function (namespace, key) {
        module = module.getChild(key);
        return namespace + (module.namespaced ? key + '/' : '');
      }, '');
    }
  }, {
    key: 'state',
    get: function get() {
      return this.root.state;
    }
  }]);

  return Store;
}();

export default Store;


function installModule(store, path, module) {
  var namespace = store._getNamespace(path);

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, path.concat(key), child);
  });
}

function makeLocalContext(store, namespace, path) {
  var noNamespace = namespace === '';
  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload,
          options = args.options;
      var type = args.type;


      if (!options || !options.root) {
        type = namespace + type;
        if (!store._actions[type]) {
          console.error('[vuex] unknown local action type: ' + args.type + ', global type: ' + type);
          return;
        }
      }

      return store.dispatch(type, payload);
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload,
          options = args.options;
      var type = args.type;


      if (!options || !options.root) {
        type = namespace + type;
        if (!store._mutations[type]) {
          console.error('[vuex] unknown local mutation type: ' + args.type + ', global type: ' + type);
          return;
        }
      }

      store.commit(type, payload, options);
    }

    // getters and state object must be gotten lazily
    // because they will be changed by vm update
  };_Object$defineProperties(local, {
    getters: {
      get: noNamespace ? function () {
        return store.getters;
      } : function () {
        return makeLocalGetters(store, namespace);
      }
    },
    state: {
      get: function get() {
        return getNestedState(store.state, path);
      }
    }
  });

  return local;
}

function getNestedState(state, path) {
  return path.length ? path.reduce(function (state, key) {
    return state[key];
  }, state) : state;
}

function makeLocalGetters(store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  _Object$keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) return;

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    _Object$defineProperty(gettersProxy, localType, {
      get: function get() {
        return store.getters[type];
      },
      enumerable: true
    });
  });

  return gettersProxy;
}

function registerMutation(store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler(payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction(store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler(payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = _Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err;
      });
    } else {
      return res;
    }
  });
}

function registerGetter(store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[vuex] duplicate getter key: ' + type);
    }
    return;
  }
  store._wrappedGetters[type] = function wrappedGetter(store) {
    return rawGetter(local.state, // local state
    local.getters, // local getters
    store.state, // root state
    store.getters // root getters
    );
  };
}

function unifyObjectStyle(type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    typeof type !== 'string' && console.log('expects string as the type, but found ' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)) + '.');
  }

  return { type: type, payload: payload, options: options };
}