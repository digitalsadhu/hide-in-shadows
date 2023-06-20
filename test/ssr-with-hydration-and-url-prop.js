import { ssr } from "../client.js";
import App from "./app-with-url-prop.js";

ssr("hide-in-shadows-example-1", App, (key, value) => {
    console.log(key, value);
    if (key === "url") {
        return new URL(value);
    }
    return value;
});

