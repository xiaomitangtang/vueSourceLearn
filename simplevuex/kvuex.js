
/***
 * 维护 state  修改 commit  插件  state响应式  混入
 */

let Vue
class Store {
  constructor(options = {}) {
    this.state = new Vue({
      data: options.state
    })
    // 初始化mutation
    this.mutations = options.mutations || {}
    this.actions = options.actions || {}
    if (options.getters) {
      this.handleGetters(options.getters)
    }

  }
  commit = (type, args) => {
    this.mutations[type](this.state, args)
  }
  handleGetters(getters) {
    this.getters = {}
    Object.keys(getters).forEach(key => {
      // 定义只读属性
      Object.defineProperties(this.getters, key, {
        get: () => {
          return getters[key](this.state)
        }
      })
    })
  }
  dispatch = (type, args) => {
    this.actions[type](this, args)
  }
}
function install(_vue, storeName = '$store') {
  Vue = _vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype[storeName] = this.$options.store
      }
    }
  })
}
export default {
  Store, install
}