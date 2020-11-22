/* @flow */

import { mergeOptions } from '../util/index'

export function initMixin(Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 把传入的option混入到全局
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
