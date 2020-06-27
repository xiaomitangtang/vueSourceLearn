
let Vue
class VueRouter {
  constructor(options) {
    this.$options = options
    // 创建一个映射
    this.routeMap = {}
    this.app = new Vue({
      data: {
        current: "/"
      }
    })
  }
  init() {
    // 绑定事件
    this.bindEvents()
    // 解析路由
    this.createRouteMap(this.$options)
    // 
    this.initCom()
  }
  bindEvents() {
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    window.addEventListener('load', this.onHashChange.bind(this))
  }
  onHashChange(e) {
    console.log(e)
    // this.app.current=e
    this.app.current = window.location.hash.slice(1) || '/'
  }
  createRouteMap(options) {
    options.routes.forEach(item => {
      this.routeMap[item.path] = item
    });
  }
  initCom() {
    Vue.component('router-link', {
      props: {
        to: String,

      },
      render(h) {
        return h('a', { attrs: { href: `#${this.to}` } }, this.$slots.default)
        // return <a href={this.to}>{this.$slots.default}</a>
      }
    })
    Vue.component('router-view', {
      functional: true,
      render: (h, ctx) => {
        console.log({ ctx, isSanmeCreate: h === ctx.parent.$createElement })
        ctx.data.isMyrouterView = true
        // 箭头函数，this、指向当前的router
        const comp = this.routeMap[this.app.current].component
        return h(comp)
      }
    })
  }
  beforeEach() {

  }
  static install(_Vue) {
    Vue = _Vue
    Vue.mixin({
      beforeCreate() {
        // 此函数会在外面初始化的时候被调用,实现了Vue的扩展
        // this  为所有的组件（当前）
        if (this.$options.router) {
          // 因为只挂在了根组件，所以只会在根组件中执行一次
          Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
}



export default VueRouter