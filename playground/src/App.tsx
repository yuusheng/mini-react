import React from 'mini-react'

function App() {
  return (
    <div>
      <h1>Hello React</h1>
      <span>
        <i>hello</i>
      </span>
      <Counter num={1} />
    </div>
  )
}

function Counter({ num }: { num: number }) {
  function handleClick() {
    console.log('click')
  }

  return (
    <div>
      Counter: {num}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

export default App
