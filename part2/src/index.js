class Vue {
  constructor(data) {
    this.data = data;
  }
  render() {
    console.log("this.age = " + this.data.age);
  }
  renderName() {
    console.log("this.name = " + this.data.name);
  }
}

var data = { name: "xiaomin", age: 20 };
observe(data);
let vm = new Vue(data);
let watcher = new Watcher(vm, function updateComponent() {
  this.render();
});
// 输出: this.age = 20

vm.data.age = 10;
// 输出: this.age = 10

vm.data.name = "xiaohua";
// 不触发render()，无输出
// 因为name在vm并没用被使用，所以不在$watcher的依赖项中

vm.renderName();
// 输出: this.name = xiaohua

vm.data.name = "xiaoxiao";
// 不触发render()，无输出
// 此时$watcher依然无data.name的依赖，因为需要执行$watcher.get()才能添加依赖

let $watcher = new Watcher(vm, "data.age", function cb(value, oldValue) {
  this.render();
  this.renderName();
});
data.name = "haha";
data.age = 50;
// 输出:  this.age = 10
//        this.name = haha

data.age = 40;
// 输出: this.age = 40 //watcher中render()的输出结果
