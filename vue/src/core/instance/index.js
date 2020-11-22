import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'


// 原始的Vue 构造函数
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)//实现Vue的原型  _init
// 初始化 数据  prop  data  methods watch computed等动态监听




stateMixin(Vue)//挂载$data $props  $set $delete $watch  工具函数
// $watch   返回的是 unwatch  可以用于取消监听
// $watch 第一个参数可以传字符串，也可以传函数，函数形式监听的是其返回值，返回值变化触发钩子
//定义  $data  $props $set $delete $watch



eventsMixin(Vue)//挂载 $on   $on可以接收事件名数组   $once  $off
// this.$on(['once','destory'...]) 会依次绑定事件
// 理论上 $on 第一个参数可以接收多维数组。。。。不过没啥意思
//  $once 用一个函数代理，这个函数在执行时 首先把自己卸载了
// 如果  以 hook:开头  会被认为是钩子函数

// $off  不传参数会把所有_event 移除  危险
// 移除是数组逆向遍历，所以，，不要传空的箭头函数。。。
// $emit  触发当前实例的所有监听对应的名字，  自己触发 自己监听！！！！
lifecycleMixin(Vue)
//  _update  定义
// $destroy $forceUpdate挂载
// destory 完成之后  再去取消监听函数
// forceUpdate 本质  是执行组件实例的watcher的update
// destory
// 从父组件children中移除自己
// wacther的销毁
// data的vmCount --
// 通过__pathch__(vnode,null) 卸载dom
// 调用钩子函数
// 卸载监听函数
// 去掉dom的__vue__指向


renderMixin(Vue)
// 挂载 $nextTick    _render
export default Vue
