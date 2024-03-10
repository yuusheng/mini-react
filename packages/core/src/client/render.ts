import type { Fiber, FiberNodeDOM, ReactElement, VirtualElementProps } from '../types'

import { assertExist, assertString } from '../utils'

let nextUnitOfWork: Fiber | null
let wipRoot: Fiber | null = null
const deletions: Fiber[] = []
let wipFiber: Fiber | null = null

export function render(element: ReactElement, container: FiberNodeDOM) {
  wipRoot = {
    type: 'div',
    dom: container,
    props: {
      children: [element],
    },
  }
  nextUnitOfWork = wipRoot
  requestIdleCallback(workLoop)
}

export function update() {
  const currentFiber = wipFiber
  return () => {
    assertExist(currentFiber)
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
    nextUnitOfWork = wipRoot
    requestIdleCallback(workLoop)
    deletions.length = 0
  }
}

interface StateHook<T = unknown> {
  state: T
  queue: ((arg?: any) => T)[]
}

let stateHooks: StateHook[]
let stateHookIndex: number
export function useState<T = unknown>(initial: T) {
  const currentFiber = wipFiber
  assertExist(currentFiber)
  const oldStateHook = currentFiber?.alternate?.$$stateHooks?.[stateHookIndex] as StateHook<T> | undefined

  const stateHook: StateHook<T> = {
    state: oldStateHook?.state ?? initial,
    queue: oldStateHook?.queue ?? [],
  }
  stateHooks.push(stateHook)
  currentFiber.$$stateHooks = stateHooks
  stateHookIndex++

  const setState = (action: ((prevState: T) => T) | T) => {
    const updater = typeof action === 'function'
      ? action as (state: T) => T
      : () => action

    stateHook.state = updater(stateHook.state)

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    }
    nextUnitOfWork = wipRoot
    requestIdleCallback(workLoop)
    deletions.length = 0
  }
  return [stateHook.state, setState] as const
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
    if (nextUnitOfWork?.type === wipRoot?.sibling?.type) {
      nextUnitOfWork = null
    }
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork) {
    commitRoot()
  }

  nextUnitOfWork && requestIdleCallback(workLoop)
}

function commitRoot() {
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

  const commitDeletion = (deletion?: Fiber) => {
    if (!deletion) {
      return
    }

    if (deletion.dom) {
      const parentFiber = findParentFiber(deletion)
      parentFiber?.dom?.removeChild(deletion.dom)
    } else {
      commitDeletion(deletion.child)
    }
  }

  const commitWork = (fiber?: Fiber) => {
    if (fiber) {
      if (fiber.dom) {
        const parentFiber = findParentFiber(fiber)

        switch (fiber.effectTag) {
          case 'REPLACEMENT':
            commitReplacement(parentFiber?.dom, fiber.dom)
            break

          case 'UPDATE':
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

  for (const deletion of deletions) {
    commitDeletion(deletion)
  }

  commitWork(wipRoot?.child)
  wipRoot = null
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
        effectTag: 'UPDATE',
      }
    }

    if (!isSameType) {
      newFiber = {
        type: virtualElement.type,
        dom: null,
        props: virtualElement.props,
        parent: fiber,
        effectTag: 'REPLACEMENT',
      }

      if (oldFiber) {
        deletions.push(oldFiber)
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
      wipFiber = fiber
      stateHooks = []
      stateHookIndex = 0
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

  return null
}
