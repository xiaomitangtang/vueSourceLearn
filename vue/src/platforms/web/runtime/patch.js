/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules)
// nodeOps   对于节点的各种操作库   比如节点属性  节点增删等等   不同的平台提供不同的适配库
export const patch: Function = createPatchFunction({ nodeOps, modules })
