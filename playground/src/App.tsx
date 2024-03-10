import React from 'mini-react'
let count = 1

function App() {
  return (
    <div>
      <h1>Hello React</h1>
      <span>
        <i>hello</i>
      </span>
      <Counter />
    </div>
  )
}

function Counter() {
  function handleClick() {
    React.update()

    count++
    console.log('click')
  }

  return (
    <div>
      Counter: {count}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

export default App
