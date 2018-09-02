export default class Dep {
  constructor () {
    this.deps = []
  }

  depend () {
    if (Dep.target && this.deps.indexOf(Dep.target) === -1) {
      this.deps.push(Dep.target)
    }
  }

  notify () {
    this.deps.forEach((dep) => {
      dep()
    })
  }
}

Dep.target = null