let data = { name: "aaa", phone: 1212, age: 18 };
observe(data);

// 初始化时触发get，更新Dep.subs
new Watcher(data, () => {
  let name = data.name;
  console.log("name");
});

new Watcher(data, () => {
  let phone = data.phone;
  console.log("phone");
});
