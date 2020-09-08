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

initMixin(Vue)//实现Vue的原型  _init  函数  调用 beforeCreate  created 钩子
// 可以解释，为什么created之前不能使用this
stateMixin(Vue)//挂载$data $props  $set $delete $watch  工具函数
// $watch   返回的是 unwatch  可以用于取消监听
// $watch 第一个参数可以传字符串，也可以传函数，函数形式监听的是其返回值，返回值变化触发钩子
//



eventsMixin(Vue)//挂载 $on   $on可以接收事件名数组   $once  $off
// this.$on(['once','destory'...]) 会依次绑定事件
// 理论上 $on 第一个参数可以接收多维数组。。。。不过没啥意思
//  $once 用一个函数代理，这个函数在执行时 首先把自己卸载了
// 如果  以 hook:开头  会被认为是钩子函数

// $off  不传参数会把所有_event 移除  危险
// 移除是数组逆向遍历，所以，，不要传空的箭头函数。。。
// $emit  触发当前实例的所有监听对应的名字，  自己触发 自己监听！！！！
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
