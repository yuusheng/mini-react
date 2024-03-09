import React from 'mini-react'
import App from './App'

const container = document.querySelector('#root') as HTMLElement

React.createRoot(container).render(<App />)
