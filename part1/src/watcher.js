class Watcher {
  constructor(vm, expOrFn, cb) {
    this.id = ++uid;
    this.cb = this.cb;
    this.vm = vm; // 执行上下文
    this.getter = expOrFn;
    this.deps = [];
    this.newDeps = [];
    this.value = this.get();
  }
  get() {
    Dep.target = this;
    let value = this.getter.call(this.vm);
    Dep.target = null;
    // this.cleanupDeps();
    return value;
  }
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDeps.includes(dep)) {
        dep.removeSub(this);
      }
    }
    this.deps = this.newDeps;
    this.newDeps = [];
  }
  addDep(dep) {
    // 避免重复添加
    if (!this.deps.includes(dep)) {
      this.newDeps.push(dep);
      dep.addSub(this);
    }
  }
  update() {
    // 触发所有的defineProperty下get方法，重新收集依赖
    let oldValue = this.value;
    this.value = this.get();
    this.cb && this.cb.call(this.vm, this.value, oldValue);
  }
}
