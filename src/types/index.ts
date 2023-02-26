export type NODE_TYPE = keyof HTMLElementTagNameMap | 'TEXT_ELEMENT'

export interface ReactElement {
  type: NODE_TYPE
  props: {
    [key: string]: any
    children: ReactElement[]
  }
}
