import type { Fiber, ReactElement } from '../types'
import { isFunction } from '../utils'

let nextUnitOfWork: Fiber | undefined
let root: Fiber | null
export function render(element: ReactElement, container: (HTMLElement | Text)) {
  nextUnitOfWork = {
    dom: container as HTMLElement,
    props: {
      children: [element],
    },
  }
  requestIdleCallback(workLoop)
  root = nextUnitOfWork
}

function createDom(fiber: Fiber) {
  if (isFunction(fiber.type))
    return

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

  if (!nextUnitOfWork)
    unifyCommit()

  nextUnitOfWork && requestIdleCallback(workLoop)
}

function unifyCommit() {
  commitWork(root?.child)
  root = null
}

function commitWork(fiber?: Fiber) {
  if (!fiber)
    return
  fiber.parent?.dom?.appendChild(fiber.dom!)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function performUnitOfWork(fiber: Fiber) {
  if (!fiber.dom)
    fiber.dom = createDom(fiber)

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
