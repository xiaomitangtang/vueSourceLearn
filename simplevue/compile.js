// 遍历dom结构， 解析指令和插值表达式

/**
 * nodeType   nodeValue               nodeName
 * 1  元素    undefined/null           与标签名相同  如 DIV
 * 2  属性    属性值                    与属性名相同
 * 3  文本    文本本身                    #text
 * 8  注释
 * 9  文档                              #document
 * 
 * 11 文档片段  null                   #document-fragment                createDocumentFragment
 * 
 * appendChild  将元素移入另一个元素内部   会移除原位置
 * */
class Compile {
  // el-带编译的模板
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)
    // 吧模板中的内容移到片段操作
    this.$fragement = this.node2Fragment(this.$el)
    // 执行编译
    this.compile(this.$fragement)
    // 放回$el中
    this.$el.appendChild(this.$fragement)
  }
  node2Fragment(el) {
    console.log(el)
    const fragment = document.createDocumentFragment();
    let child
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  compile(el) {
    const childNoses = el.childNodes
    Array.from(childNoses).forEach(node => {
      const nodeType = node.nodeType
      if (nodeType === 1) {
        console.log('编译元素' + node.nodeName)
        this.compileElement(node)
      } else if (this.isInter(node)) {
        console.log(`编译插值文本${node.textContent}`)
        node.oritextContent = node.textContent
        this.compileText(node)
      } else if (nodeType === 2) {
        console.log('属性节点', node)
      }
      if (node.children && node.childNodes.length) {
        this.compile(node)
      }
    })

  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
  compileText(node) {
    // const s1 = this.$vm[RegExp.$1]
    const exp = RegExp.$1
    this.update(node, exp, 'text')
    // node.textContent = node.oritextContent.replace(/\{\{.*\}\}/, exp)
  }
  update(node, exp, dir) {
    const updator = this[dir + 'Updator']
    updator && updator(node, this.$vm[exp])
    new Watcher(this.$vm, exp, () => {
      updator && updator(node, this.$vm[exp])
    })
  }
  textUpdator(node, value) {
    node.textContent = value

  }
  modelUpdator(node, value) {
    node.value = value
  }
  compileElement(node) {
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name
      const exp = attr.value
      if (attrName.indexOf('k-') === 0) {
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
    })
  }
  // dir
  text(node, exp) {
    this.update(node, exp, 'text')
  }
  model(node, exp) {
    // node.addEventLisenner
    this.update(node, exp, 'model')
    node.addEventListener('input', e => {
      this.$vm[exp] = e.target.value
    })
    // node.oninput = e => {
    //   this.$vm[exp] = e.target.value
    // }

  }
}