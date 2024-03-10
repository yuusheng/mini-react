import type { Fiber, FiberNodeDOM, ReactElement, VirtualElementProps } from '../types'

import { assertExist, assertString } from '../utils'

let nextUnitOfWork: Fiber | undefined
let wipRoot: Fiber | null = null
let currentRoot: Fiber

export function render(element: ReactElement, container: FiberNodeDOM) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  }
  requestIdleCallback(workLoop)
  nextUnitOfWork = wipRoot
}

export function update() {
  assertExist(currentRoot)

  nextUnitOfWork = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  }
  wipRoot = nextUnitOfWork
  requestIdleCallback(workLoop)
}

function updateDOM(
  DOM: NonNullable<FiberNodeDOM>,
  prevProps: VirtualElementProps,
  nextProps: VirtualElementProps,
) {
  const isProperty = (key: string) => key !== 'children'
  const isEvent = (key: string) => key.startsWith('on')

  for (const [k, v] of Object.entries(prevProps)) {
    if (k.startsWith('on')) {
      DOM.removeEventListener(
        k.slice(2).toLowerCase(),
        v as EventListener,
      )
    } else if (isProperty(k)) {
      // @ts-expect-error expect k as DOM's attribute
      DOM[k] = undefined
    }
  }

  for (const [k, v] of Object.entries(nextProps)) {
    if (isEvent(k)) {
      DOM.addEventListener(
        k.slice(2).toLowerCase(),
        v as EventListener,
      )
    } else if (isProperty(k)) {
      // @ts-expect-error expect k as DOM's attribute
      DOM[k] = v
    }
  }
}

function createDom(fiber: Fiber) {
  let dom = fiber.dom
  if (!dom) {
    assertString(fiber.type)
    dom = fiber.type !== 'TEXT_ELEMENT'
      ? document.createElement(fiber.type)
      : document.createTextNode('')
  }
  if (dom) {
    updateDOM(dom, {}, fiber.props)
  }

  return dom
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork) {
    commitRoot()
  }

  nextUnitOfWork && requestIdleCallback(workLoop)
}

function commitRoot() {
  assertExist(wipRoot)

  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber?: Fiber) {
  const findParentFiber = (fiber?: Fiber) => {
    if (fiber) {
      let parentFiber = fiber.parent
      while (parentFiber && !parentFiber.dom) {
        parentFiber = parentFiber.parent
      }

      return parentFiber
    }

    return null
  }

  const commitReplacement = (
    parentDOM: FiberNodeDOM,
    DOM: NonNullable<FiberNodeDOM>,
  ) => {
    if (parentDOM) {
      parentDOM.appendChild(DOM)
    }
  }

  if (fiber) {
    if (fiber.dom) {
      const parentFiber = findParentFiber(fiber)

      switch (fiber.effectTag) {
        case 'UPDATE':
          commitReplacement(parentFiber?.dom, fiber.dom)
          break

        case 'REPLACEMENT':
          updateDOM(fiber.dom, fiber.alternate?.props ?? {}, fiber.props)
          break

        default:
          break
      }
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
  }
}

function reconcileChildren(fiber: Fiber, virtualElements: ReactElement[] = []) {
  let oldFiber = fiber.alternate?.child
  let prevSibling: Fiber | undefined

  for (const index in virtualElements) {
    const virtualElement = virtualElements[index]
    const isSameType = oldFiber && oldFiber.type === virtualElement.type

    let newFiber: Fiber | undefined
    if (isSameType && oldFiber) {
      newFiber = {
        type: virtualElement.type,
        dom: oldFiber.dom,
        alternate: oldFiber,
        props: virtualElement.props,
        parent: fiber,
        effectTag: 'REPLACEMENT',
      }
    }

    if (!isSameType) {
      newFiber = {
        type: virtualElement.type,
        dom: null,
        props: virtualElement.props,
        parent: fiber,
        effectTag: 'UPDATE',
      }
    }

    if (oldFiber) {
      // oldFiber point to next sibling
      oldFiber = oldFiber.sibling
    }

    if (index === '0') {
      fiber.child = newFiber
    } else if (prevSibling) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
  }
}

function performUnitOfWork(fiber: Fiber) {
  switch (typeof fiber.type) {
    case 'number':
    case 'string':
      if (!fiber.dom) {
        fiber.dom = createDom(fiber)
      }

      reconcileChildren(fiber, fiber.props.children)
      break

    case 'function':
      reconcileChildren(fiber, [fiber.type(fiber.props)])
      break

    default:
      if (fiber.props) {
        reconcileChildren(fiber, fiber.props.children)
      }

      break
  }

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber: Fiber | undefined = fiber
  while (nextFiber !== undefined) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }

    nextFiber = nextFiber?.parent
  }
}
