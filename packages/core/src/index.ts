import { createElement, render } from './client'
import { JSXTransformedElement, ReactElement } from './types'

const React = {
  createElement,
  createRoot(root: HTMLElement) {
    return {
      render(component: JSXTransformedElement) {
        const _component = typeof component.type === 'function' 
          ? component.type()
          : component as ReactElement
        render(_component, root)
      },
    }
  }
}

export * from './client'
export * from './types'
export * from './utils'
export default React
