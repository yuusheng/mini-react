import { createElement, render, update } from './client'
import type { FiberNodeDOM, ReactElement } from './types'

const React = {
  createElement,
  createRoot(root: FiberNodeDOM) {
    return {
      render(component: ReactElement) {
        render(component, root)
      },
    }
  },
  update,
}

export * from './client'
export * from './types'
export * from './utils'
export default React
