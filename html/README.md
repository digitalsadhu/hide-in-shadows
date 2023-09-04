# Hide In Shadows HTML

A small, zero dependency library for wrapping markup in declarative shadow dom.

## Usage

### Installation

```
npm install @hide-in-shadows/html
```

### Isolated Markup

If you want to isolate your markup inside the shadow dom, read on...

#### The Code

```js
import { wrap } from "@hide-in-shadows/html";

const markup = `
    <h1>Isolated Markup!</h1>
    <div>This markup will be isolated inside declarative shadow DOM</div>
`;

const options = {
  mode: "open", // or "closed", defaults to "open"
};

const rendered = wrap(
  "hide-in-shadows-example", // name to use for custom element in the DOM
  markup, // HTML markup in a string
  options // additional options
);

// you should then respond with "rendered" from your server
```

### Caveats

The same trade offs for using shadow DOM anywhere else exist here as well. Global styles won't affect the wrapped markup, global scripts won`t target the wrapped markup and so on.
If you have existing scripts, you may need to rewrite them to ensure they target the correct elements.

Eg.

```js
document.querySelector("#some-id");
```

Will need to be changed to reach into the shadow DOM if it is to continue working

```js
document
  .querySelector("hide-in-shadows-example")
  .shadowRoot.querySelector("#some-id");
```
