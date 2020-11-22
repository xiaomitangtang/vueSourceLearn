/* @flow */

import { toArray } from '../util/index'

export function initUse(Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      // use多次 只会安装一次
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    // 将Vue  （this  作为use的第一个参数传给  目标的install ）
    // 绑定了this，install中的this指向插件自己

    // 另外，插件如果是一个函数，，相当于本身就是install
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
