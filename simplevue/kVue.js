
// var obj = {}
// Object.defineProperty(obj, 'name', {
//   get() {
//     console.log('有人想要获取name属性')
//     return
//   },
//   set(val) {
//     console.log('有人想要修改name属性')

//   }
// })
// import Compile from './compile'


class Kvue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.observe(this.$data)
    new Compile(options.el, this)
  }
  observe(value) {
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        this.defineReactive(value, key, value[key])
        this.defineProxy(key)
      })
    }
  }
  defineReactive(obj, key, value) {
    this.observe(value)
    // 给每一个键定义拦截
    const dep = new Dep()   //每个dep与一个属性一对一关系
    Object.defineProperty(obj, key, {
      get() {
        // 收集过程
        Dep.target && dep.addDep(Dep.target)
        return value
      },
      set(nval) {
        if (nval !== value) {
          value = nval
          dep.notify()
        }
      }
    })
  }
  defineProxy(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(nval) {
        this.$data[key] = nval
      }
    })
  }

}


// 管理watcher
class Dep {
  constructor() {
    this.deps = []
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  notify() {
    this.deps.forEach(dep => dep.update())
  }
}
// 保存watcher  保存data数值与页面挂钩的关系
class Watcher {
  constructor(vm, key, cb) {
    // 创建实例时，立即将该实例指向Dep的Target 便于依赖收集
    this.vm = vm
    this.key = key
    this.cb = cb
    Dep.target = this
    this.vm[this.key]//仅仅为了获取一次，触发一次get，然后进行依赖收集，没有其他作用
    Dep.target = null

  }
  update() {
    // console.log(`${this.key}更新了`)
    this.cb.call(this.vm)
  }
}

