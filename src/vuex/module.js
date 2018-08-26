const {forEachValue} = require('../utils');

export default class Module {
  constructor (rawModule, defineReactive, path = []) {
    this.rawModule = rawModule
    this.children = Object.create(null)

    this.state = rawModule.state || {}
    // defineReactive(this, 'state', rawModule.state || {}, path.concat('state'))
  }

  get namespaced () {
    return !!this.rawModule.namespaced
  }

  addChild (key, module) {
    this.state[key] = module.state
    this.children[key] = module
  }

  removeChild (key) {
    delete this.state[key]
    delete this.children[key]
  }

  getChild (key) {
    return this.children[key]
  }

  forEachGetter (fn) {
    this.rawModule.getters && forEachValue(this.rawModule.getters, fn)
  }

  forEachAction (fn) {
    this.rawModule.actions && forEachValue(this.rawModule.actions, fn)
  }

  forEachMutation (fn) {
    this.rawModule.mutations && forEachValue(this.rawModule.mutations, fn)
  }

  forEachChild (fn) {
    this.children && forEachValue(this.children, fn)
  }
}