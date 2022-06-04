class Watcher {
  constructor(target, expFn, cb) {
    this.dirty = this.lazy = false; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.id = ++uid;
    this.cb = cb;
    this.vm = target;
    if (typeof expFn === "function") {
      this.getter = expFn;
    } else {
      const segments = expFn.split(".");
      this.getter = function (obj) {
        for (let i = 0; i < segments.length; i++) {
          obj = obj[segments[i]];
        }
        return obj;
      };
    }
    this.value = this.get();
  }
  get() {
    Dep.target = this;
    let value = this.getter.call(this.vm, this.vm);
    Dep.target = null;
    return value;
  }

  addDep(dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }
  update() {
    const value = this.get();
    if (value !== this.value) {
      const oldValue = this.value;
      this.value = value;
      this.cb && this.cb.call(this.vm, value, oldValue);
    }
  }
}
