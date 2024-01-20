import type { Fiber, ReactElement } from '../types'

let nextUnitOfWork: Fiber | undefined

export function render(element: ReactElement, container: (HTMLElement | Text)) {
  nextUnitOfWork = {
    dom: container as HTMLElement,
    props: {
      children: [element],
    },
  }
  requestIdleCallback(workLoop)
}

function createDom(fiber: Fiber) {
  const dom = fiber.type !== 'TEXT_ELEMENT'
    ? document.createElement(fiber.type!)
    : document.createTextNode('')

  const isProperty = (key: string) => key !== 'children'
  const props = Object.fromEntries(
    Object.entries(fiber.props)
      .filter(([k]) => isProperty(k)),
  )
  Object.assign(dom, props)
  return dom
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }
  nextUnitOfWork && requestIdleCallback(workLoop)
}

function performUnitOfWork(fiber: Fiber) {
  if (!fiber.dom)
    fiber.dom = createDom(fiber)

  if (fiber.parent)
    fiber.parent.dom!.appendChild(fiber.dom!)

  const elements = fiber.props.children
  let prevFiber: Fiber

  for (const index in elements) {
    const element = elements[index]

    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
    }

    if (index === '0')
      fiber.child = newFiber
    else
      prevFiber!.sibling = newFiber

    prevFiber = newFiber
  }

  return fiber.child ?? fiber.sibling ?? fiber.parent?.sibling
}
