const NO_INIITIAL_VALUE = {}; // 该对象setter方法为空
class Observer {
  dep;
  constructor(value, shallow) {
    // 每个Observer实例下都挂载了一个Dep
    this.dep = new Dep();
    Object.defineProperty(value, "__ob__", { value: this });
    if (Array.isArray(value)) {
      // shallow 默认是 undefined，进行深度观测。
      // 当观测vue属性$attr，$lisenter时shallow为 false
      if (!shallow) {
        this.observeArray(value);
      }
    } else {
      this.walk(value, shallow);
    }
  }
  // 用于对象部署defineProperty
  walk(obj, shallow) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      defineReactive(obj, key, NO_INIITIAL_VALUE, undefined, shallow);
    }
  }
  // 用于数组部署defineProperty
  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

let shouldObserve = true;
function observe(value, shallow) {
  let ob;
  if (value.__ob__ instanceof Observer) {
    // Observer对象只会实例化一次
    ob = value.__ob__;
  } else if (shouldObserve && Object.isExtensible(value)) {
    // isExtensible判断value是一个可扩展的对象，如果是Number、String类型，则Observer结束
    // shouldObserve是一个开关，可以控制是否需要添加观察者
    // 比如处理props数据时，请查看updateChildComponent
    ob = new Observer(value, shallow);
  }
  return ob;
}

function defineReactive(obj, key, val, customSetter, shallow) {
  const dep = new Dep();
  const property = Object.getOwnPropertyDescriptor(obj, key);
  // 保存原始的get和set方法
  const getter = property && property.get;
  const setter = property && property.set;

  // 根据不同的参数对val进行特殊处理
  // ps：obj为Object.create(null)时，getter为空
  if ((!getter || setter) && (val === NO_INIITIAL_VALUE || arguments.length === 2)) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    // 劫持get
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      // 取值时，从Dep.target开始，自顶向下收集dep依赖关系
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      // ref类型取存放在value.value中
      return value;
    },
    // 劫持set
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      // value和newVal一致，说明无更新，不需要`notify`
      if (value === newVal) {
        return;
      }
      if (setter) {
        setter.call(obj, newVal);
      } else if (getter) {
        // ps：只读的属性，setter为空
        return;
      } else {
        val = newVal;
      }
      // 深度遍历子属性，并转化成Observe实例
      childOb = !shallow && observe(newVal);
      // 触发对应的依赖进行更新，可以理解为是发布事件
      dep.notify();
    },
  });
  return dep;
}
