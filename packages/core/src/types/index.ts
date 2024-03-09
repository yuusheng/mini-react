export type NODE_TYPE = keyof HTMLElementTagNameMap | 'TEXT_ELEMENT'

export interface ReactElement {
  type: NODE_TYPE
  props: {
    [key: string]: any
    children: ReactElement[]
  }
}

export interface JSXTransformedElement {
  type: NODE_TYPE | (() => ReactElement)
  props: {
    [key: string]: any
    children: ReactElement[]
  }
}

export interface Fiber {
  type?: string | ((...props: unknown[]) => ReactElement)
  dom?: HTMLElement | Text
  props: {
    children: ReactElement[]
    [key: string]: unknown
  }
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
}
