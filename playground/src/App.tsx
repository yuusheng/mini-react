import React from 'mini-react'

let count = 1
let fooValue = true

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

  function toggleFooBar() {
    React.update()
    fooValue = !fooValue
  }

  const Foo = () => <div>foo</div>
  const bar = <p>bar</p>

  return (
    <div>
      {/* Counter: {count}
      <button onClick={handleClick}>click</button> */}

      <button onClick={toggleFooBar}>toggle</button>
      <span>
        <div>{ fooValue ? <Foo /> : bar }</div>
        <span>wooo</span>
      </span>
    </div>
  )
}
export default Counter
