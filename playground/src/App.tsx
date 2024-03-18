import React from 'mini-react'

function Foo() {
  const [count, setCount] = React.useState(0)
  const [foo, setFoo] = React.useState('foo')
  function handleClick() {
    // console.log('click foo')
    // setCount(count + 1)
    // setCount(count => count + 1)

    setFoo(foo => `${foo}foo`)
  }
  // console.log('rerender foo')

  React.useEffect(() => {
    setCount(count => count + 1)
    console.log('hello')
  }, [foo])

  return (
    <div>
      <div>{count}</div>
      <div>{foo}</div>
      <button onClick={handleClick}>click foo</button>
    </div>
  )
}

function Counter() {
  return (
    <div>
      <Foo />
    </div>
  )
}
export default Counter
