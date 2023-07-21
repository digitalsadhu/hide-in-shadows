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

function App() {
  return createElement(
    'div',
    null,
    createElement('h1', null, 'Hello, world!'),
    createElement(Counter)
  );
}

export default App;