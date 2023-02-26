import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

const element = {
  type: 'h1',
  props: {
    title: 'foo',
    children: 'Hello React'
  }
}

const container = document.querySelector('#root')!

const node = document.createElement(element.type)
node.title = element.props.title

const textNode = document.createTextNode('')
textNode.nodeValue = element.props.children

node.appendChild(textNode)
container.appendChild(node)
