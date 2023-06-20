# Hide In Shadows

A small library for wrapping React apps in shadow dom.

## Usage

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

const options = {
    props, // a props object. This will be serialised and made available when hydrating on the client side.
    styles, // inline styles to be included in the shadow dom. Inlining styles is good for avoiding FOUC issues.
    replacer, // function to control how objects are serialized. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    mode = "open" // shadow dom mode See https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM. Defaults to "open"
}
const rendered = ssr("hide-in-shadows-example", App, options);

// respond with "rendered" from your server
```

#### Client code

```js
import { ssr } from "hide-in-shadows";
import App from "./app.js"; // your React app component.

const options = {
  reviver, // function to control how the DOM serialised props object is deserialised. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse.
};
// calling this method will cause it to hydrate the DOM that was setup in the server code section above.
ssr("hide-in-shadows-example", App, options);
```

##### Example reviver usage

The following example shows using the reviver function to regenerate URL objects for a prop called "url".

**Server Side**

```js
import { ssr } from "hide-in-shadows/server";
import App from "./app.js";

ssr("my-app", App, {
  props: { url: new URL("https://example.com") },
});
```

**Client Side**

```js
import { ssr } from "hide-in-shadows/client";
import App from "./app.js";

ssr("my-app", App, {
  reviver: (key, value) => {
    if (key === "url") return new URL(value);
    return value;
  },
});
```

#### Example styles usage

It is generally prefereable to use inline styles rather than external URLs when working with the shadow dom due to the fact that content can display unstyled with external style URLs are fetched.
Using a library such as Tailwind that allows you to purge your CSS down to a minimum can help with this though you are free to provide any styles you wish. If you do still plan on using an external stylesheet, include a link tag in your app and be sure to preload the URL in the document head to help avoid a flash of unstyled content.

**Server Side**

```js
import { ssr } from "hide-in-shadows/server";
import App from "./app.js";

ssr("my-app", App, {
  styles: `
    h1 {
        background-color: hotpink;
    }
  `,
});
```

or, read in the contents of an external stylesheet like so:

```js
import { ssr } from "hide-in-shadows/server";
import fs from "node:fs/promises";
import App from "./app.js";

const styles = await fs.readFile(
  new URL("./styles.css", import.meta.url),
  "utf8"
);
ssr("my-app", App, { styles });
```

Styles added in these ways will be encapsulated inside the shadow dom.
