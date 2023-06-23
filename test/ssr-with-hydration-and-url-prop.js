import { hydrate } from "../client.js";
import App from "./app-with-url-prop.js";

hydrate("hide-in-shadows-example-1", App, {
  reviver: (key, value) => {
    if (key === "url") {
      return new URL(value);
    }
    return value;
  },
});
