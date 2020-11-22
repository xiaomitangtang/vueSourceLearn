/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'
// 入口文件
const idToTemplate = cached(id => {
  // 通过  id  获取到元素的innerHtml   内部结构
  const el = query(id)
  return el && el.innerHTML
})

// 扩展$mount   加入了编译器，所以只有 浏览器版才可以使用template，工程版本不可用
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,//
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */

  // 不让挂载到body  html上，自己写一个div去绑定
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // 最终都是转换为render函数执行，如果是写的render，直接使用不转换
  // resolve template/el and convert to render function


  // 顺序    render > template  > el
  // template顺序   选择器>节点   没有template 会尝试使用  el作为内容
  // 如果  没有render  没有template  没有el  就报错
  if (!options.render) {
    let template = options.template
    if (template) {
      // template  可以是 模板字符串   dom的id   以及dom节点   分别解析
      // 如果是字符串，如果第一个是#  则一定是选择器
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          // 如果选择器内容为空，则vue没有模板进行转换，会报警告
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
        // 如果不是字符串，并且有nodeType，说明一定是dom元素，直接获取其innerHtml
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        // 如果不是模板字符串  也不是选择器，也不是节点  报错
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 如果没有传递template  尝试查找挂载点的内容作为模板
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      // 将获取到的template转换为render
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
