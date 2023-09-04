import assert from "node:assert/strict";
import fs from "node:fs";

const polyfill = fs.readFileSync(
  new URL("./dist/polyfill.js", import.meta.url),
  "utf8"
);

/**
 * Wraps HTML markup in declarative shadow DOM. Returns an HTML string ready for insertion into the DOM.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name.
 * @param {string} markup - The markup to render.
 * @param {{ mode?: "open" | "closed" }} [options] - Serialisation options.
 * @returns {string}
 */
export function wrap(name, markup, { mode = "open" } = {}) {
  assert(typeof name === "string", "SSR: 'name' argument must be a string");
  assert(typeof markup === "string", "SSR: 'markup' argument must be a string");
  assert(
    ["open", "closed"].includes(mode),
    "SSR: 'mode' argument must be either 'open' or 'closed'"
  );
  return `
<style>${name}:not(:defined) > template[shadowrootmode] ~ *  {opacity:0;visibility:hidden;}</style>
<${name}>
  <template shadowrootmode="${mode}">
    ${markup}
  </template>
</${name}>
<script>${polyfill}</script>`;
}
