export type NODE_TYPE = keyof HTMLElementTagNameMap | 'TEXT_ELEMENT'

export type FiberNodeDOM = Element | Text | null | undefined

export type VirtualElementType = Function | string
export interface VirtualElementProps {
  children?: VirtualElement[]
  [propName: string]: unknown
}
export interface VirtualElement {
  type: VirtualElementType
  props: VirtualElementProps
}

export interface ReactElement {
  type: NODE_TYPE
  props: {
    [key: string]: any
    children: ReactElement[]
  }
}

export interface JSXTransformedElement {
  type: NODE_TYPE | ((...props: unknown[]) => ReactElement)
  props: {
    [key: string]: any
    children: ReactElement[]
  }
}

export type CleanUpFunction = () => void
export interface Fiber<T = any> extends JSXTransformedElement {
  dom?: FiberNodeDOM
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
  alternate?: Fiber<T> | null
  effectTag?: 'UPDATE' | 'REPLACEMENT'
  hooks?: {
    state: T
    queue: ((args: any) => T)[]
  }[]
  effectHooks?: {
    callback: () => CleanUpFunction | void
    deps: any[]
  }[]
}
