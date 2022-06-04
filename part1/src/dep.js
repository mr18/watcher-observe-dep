let uid = 0;
class Dep {
  constructor() {
    this.id = ++uid;
    this.subs = [];
  }
  // 添加被观测者
  addSub(sub) {
    this.subs.push(sub);
  }
  // 移除被观测者
  removeSub(sub) {
    const index = this.subs.indexOf(sub);
    if (index > -1) {
      return this.subs.splice(index, 1);
    }
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  // 发布更新
  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
