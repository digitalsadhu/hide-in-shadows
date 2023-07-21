import { client } from "../client.js";
import App from "./app-with-url-prop.js";

client("hide-in-shadows-example-1", App, {
  reviver: (key, value) => {
    if (key === "url") {
      return new URL(value);
    }
    return value;
  },
});
