import React from 'mini-react'

function App() {
  return (
    <div>
      <h1>Hello React</h1>
      <span>
        <i>hello</i>
      </span>
      <Counter num={1}/>
      <Counter num={2}/>
    </div>
  )
}

function Counter({ num }: { num: number }) {
  return <div>Counter: {num}</div>
}

export default App
