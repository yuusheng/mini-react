import type { ReactElement } from '~/types'

export function render(element: ReactElement, container: HTMLElement | Text) {
  const dom = element.type !== 'TEXT_ELEMENT'
    ? document.createElement(element.type)
    : document.createTextNode('')

  const isProperty = (key: string) => key !== 'children'
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name]
    })

  element.props.children.forEach(child => render(child, dom))
  container.appendChild(dom)
}

let nextUnitOfWork: any = null

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork,
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(nextUnitOfWork: any) {
  // TODO
  return nextUnitOfWork
}
