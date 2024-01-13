import type { Fiber, ReactElement } from '~/types'

let nextUnitOfWork: Fiber

export function render(element: ReactElement, container: HTMLElement | Text) {
  // const dom = element.type !== 'TEXT_ELEMENT'
  //   ? document.createElement(element.type)
  //   : document.createTextNode('')

  // const isProperty = (key: string) => key !== 'children'
  // Object.keys(element.props)
  //   .filter(isProperty)
  //   .forEach((name) => {
  //     dom[name] = element.props[name]
  //   })

  // element.props.children.forEach(child => render(child, dom))
  // container.appendChild(dom)
  nextUnitOfWork = {
    dom: container as HTMLElement,
    props: {
      children: [element],
    },
  }
}

function createDom(fiber: any) {
  const dom = fiber.type !== 'TEXT_ELEMENT'
    ? document.createElement(fiber.type)
    : document.createTextNode('')

  const isProperty = (key: string) => key !== 'children'
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name]
    })

  return dom
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber: Fiber) {
  if (!fiber.dom)
    fiber.dom = createDom(fiber)

  if (fiber.parent)
    fiber.parent.dom.appendChild(fiber.dom)

  const elements = fiber.props.children
  let index = 0
  let prevSibling: Fiber

  while (index < elements.length) {
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    if (index === 0)
      fiber.child = newFiber
    else
      prevSibling.sibling = newFiber

    prevSibling = newFiber
    index++
  }
  return fiber
}
