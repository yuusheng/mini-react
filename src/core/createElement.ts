import { isObject } from '~/utils'

export function createElement(type: string, props: any, ...children: any[]) {
  return {
    type,
    props: {
      props,
      children: children.map(child => isObject(child)
        ? child
        : createTextElement(child),
      ),
    },
  }
}

function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  }
}
