import { createElement, render } from './client'
import type { ReactElement } from './types'

const React = {
  createElement,
  createRoot(root: HTMLElement) {
    return {
      render(component: ReactElement) {
        render(component, root)
      },
    }
  },
}

export * from './client'
export * from './types'
export * from './utils'
export default React
