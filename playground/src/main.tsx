import { createElement, render } from 'mini-react'
import App from './App'
import React from 'mini-react'

const container = document.querySelector('#root') as HTMLElement

console.log(App)
render(<App />, container)
