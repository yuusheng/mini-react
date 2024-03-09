import type { Fiber, ReactElement } from '../types'
import { assertFunction, assertString, isFunction } from '../utils'

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
  if (fiber.dom)
    return fiber.dom

  assertString(fiber.type)

  const dom = fiber.type !== 'TEXT_ELEMENT'
    ? document.createElement(fiber.type)
    : document.createTextNode('')

  const isProperty = (key: string) => key !== 'children'
  const isEvent = (key: string) => key.startsWith('on')
  for (const [k, v] of Object.entries(fiber.props)) {
    if (!isProperty(k))
      continue

    if (isEvent(k)) {
      const event = k.slice(2).toLowerCase()
      assertFunction(v)
      dom.addEventListener(event, (e: any) => v(e))
      continue
    }

    // @ts-expect-error expect k as keyof dom
    dom[k] = v
  }

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

  let fiberParent = fiber.parent as Fiber
  while (!fiberParent.dom)
    fiberParent = fiberParent.parent

  if (fiber.dom)
    fiberParent.dom.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function updateFunctionComponentFiber(fiber: Fiber) {
  assertFunction(fiber.type)

  const elements = [fiber.type(fiber.props)]
  updateFiber(fiber, elements)
}

function updateNormalComponentFiber(fiber: Fiber) {
  fiber.dom = createDom(fiber)

  const elements = fiber.props.children
  updateFiber(fiber, elements)
}

function updateFiber(fiber: Fiber, elements: ReactElement[]) {
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
}

function performUnitOfWork(fiber: Fiber) {
  const isFunctionComponent = isFunction(fiber.type)

  if (isFunctionComponent)
    updateFunctionComponentFiber(fiber)
  else
    updateNormalComponentFiber(fiber)

  if (fiber.child)
    return fiber.child
  if (fiber.sibling)
    return fiber.sibling

  let nextUnitOfWork = fiber.parent
  while (nextUnitOfWork?.parent) {
    if (nextUnitOfWork.sibling)
      return nextUnitOfWork.sibling
    nextUnitOfWork = nextUnitOfWork?.parent
  }
}
