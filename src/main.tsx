// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from './core'

/** @jsx createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)

const container = document.querySelector('#root')!

const node = document.createElement(element.type)
node.title = element.props.title

const textNode = document.createTextNode('')
textNode.nodeValue = element.props.children

node.appendChild(textNode)
container.appendChild(node)
