import React from 'mini-react'

const count = 1
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

function Foo() {
  const update = React.update()
  function handleClick() {
    console.log('click foo')
    update()
  }
  console.log('rerender foo')

  return (
    <div>
      <div>foo</div>
      <button onClick={handleClick}>click foo</button>
    </div>
  )
}

function Bar() {
  const update = React.update()
  function handleClick() {
    console.log('click bar')
    update()
  }
  console.log('rerender bar')

  return (
    <div>
      <div>bar</div>
      <button onClick={handleClick}>click bar</button>
    </div>
  )
}

function Counter() {
  function toggleFooBar() {
    React.update()
    fooValue = !fooValue
  }

  return (
    <div>
      {/* Counter: {count}
      <button onClick={handleClick}>click</button> */}

      <button onClick={toggleFooBar}>toggle</button>
      <span>
        {/* <div>{fooValue ? <Foo /> : <Bar />}</div> */}
        <Foo />
        <Bar />
      </span>
    </div>
  )
}
export default Counter
