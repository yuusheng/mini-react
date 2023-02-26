// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement, render } from './core'

/** @jsx createElement */
const element = (
  <div id="foo">
    <h1>Hello React</h1>
  </div>
)

const container = document.querySelector('#root') as HTMLElement

render(element, container)
