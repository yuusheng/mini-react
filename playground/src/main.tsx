import App from './App'
import React from 'mini-react'

const container = document.querySelector('#root') as HTMLElement

React.createRoot(container).render(<App />)
