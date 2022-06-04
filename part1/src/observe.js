class Observer {
  constructor(value) {
    this.dep = new Dep();
    Object.defineProperty(value, "__ob__", { value: this });
    this.walk(value);
  }
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }
}

function observe(value) {
  let ob;
  if (value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (Object.isExtensible(value)) {
    ob = new Observer(value);
  }
  return ob;
}
function defineReactive(obj, key, val) {
  const property = Object.getOwnPropertyDescriptor(obj, key);
  const getter = property && property.get;
  const setter = property && property.set;
  val = val || obj[key];
  const dep = new Dep();
  //   let childOb = observe(val);
  Object.defineProperty(obj, key, {
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      dep.depend(this);
      //   if (childOb) {
      //     childOb.dep.addSub(this);
      //   }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      if (value === newVal) {
        return;
      }

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      //   childOb = observe(newVal);
      dep.notify();
    },
  });
}
