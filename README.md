# Hide In Shadows

A small library for wrapping React apps in shadow dom.

## Usage

There are 2 modes, SSR and CSR. See below.

### Installation

```
npm install hide-in-shadows react react-dom
```

### Server Side Rendered React

If you want to SSR your React app, use this approach

#### Server code

```js
import { ssr } from "hide-in-shadows/server";
import App from "./app.js"; // your React app component. You will need to bundle this if it is in JSX.

const props = { ... } // a props object. This will be serialised and made available when hydrating on the client side.
const rendered = ssr("hide-in-shadows-example", App, props);

// respond with "rendered" from your server
```

#### Client code

```js
import { ssr } from "hide-in-shadows";
import App from "./app.js"; // your React app component.

// calling this method will cause it to hydrate the DOM that was setup in the server code section above.
ssr("hide-in-shadows-example", App);
```

### Client Side Rendered React

If you only need CSR, use this approach

#### Server code

```js
import { csr } from "hide-in-shadows/server";
import App from "./app.js"; // your React app component. You will need to bundle this if it is in JSX.

const rendered = csr("hide-in-shadows-example", App);

// respond with "rendered" from your server
```

#### Client code

```js
import { csr } from "hide-in-shadows";
import App from "./app.js"; // your React app component.

// calling this method will cause it to create the React app using bootstrapping DOM that was setup in the server code section above.
csr("hide-in-shadows-example", App);
```