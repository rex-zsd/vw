import _Object$create from 'babel-runtime/core-js/object/create';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';

var _require = require('../utils'),
    forEachValue = _require.forEachValue;

var Module = function () {
  function Module(rawModule, defineReactive) {
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, Module);

    this.rawModule = rawModule;
    this.children = _Object$create(null);

    this.state = rawModule.state || {};
    // defineReactive(this, 'state', rawModule.state || {}, path.concat('state'))
  }

  _createClass(Module, [{
    key: 'addChild',
    value: function addChild(key, module) {
      this.state[key] = module.state;
      this.children[key] = module;
    }
  }, {
    key: 'removeChild',
    value: function removeChild(key) {
      delete this.state[key];
      delete this.children[key];
    }
  }, {
    key: 'getChild',
    value: function getChild(key) {
      return this.children[key];
    }
  }, {
    key: 'forEachGetter',
    value: function forEachGetter(fn) {
      this.rawModule.getters && forEachValue(this.rawModule.getters, fn);
    }
  }, {
    key: 'forEachAction',
    value: function forEachAction(fn) {
      this.rawModule.actions && forEachValue(this.rawModule.actions, fn);
    }
  }, {
    key: 'forEachMutation',
    value: function forEachMutation(fn) {
      this.rawModule.mutations && forEachValue(this.rawModule.mutations, fn);
    }
  }, {
    key: 'forEachChild',
    value: function forEachChild(fn) {
      this.children && forEachValue(this.children, fn);
    }
  }, {
    key: 'namespaced',
    get: function get() {
      return !!this.rawModule.namespaced;
    }
  }]);

  return Module;
}();

export default Module;