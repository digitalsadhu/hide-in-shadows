import { createElement, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return createElement(
    'div',
    null,
    createElement('p', { id: "click-display" }, `You clicked ${count} times`),
    createElement('button', { onClick: () => setCount(count + 1) }, 'Click me')
  );
}

function App(props) {
  return createElement(
    'div',
    null,
    createElement('h1', null, props.title),
    createElement(Counter)
  );
}

export default App;