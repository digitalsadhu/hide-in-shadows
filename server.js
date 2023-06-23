import assert from 'node:assert/strict';
import ReactDOM from "react-dom/server";
import React from "react";

/**
 * @template TProps
 * @typedef {Object} SSROptions
 * @property {TProps} [props] - Application props. These will be serialised and passed to the client for hydration as well as used to SSR the application/component.
 * @property {(this: any, key: string, value: any) => any} [replacer] - A function that transforms the results. This function is called for each member of the object. If a property is excluded then the value returned is null.
 * @property {string} [styles] - Inline styling to be added to the shadow root.
 * @property {"open" | "closed"} [mode] - The mode of the shadow root. Can be "open" or "closed". Defaults to "open".
 */

/**
 * Server renders a React app/component and returns an HTML string ready for insertion into the DOM.
 * @template TProps
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the client.
 * @param {string | function} app - The React component/app to render. Can be a React component or a pre-rendered string.
 * @param {SSROptions<TProps>} [options] - Application props. These will be serialised and passed to the client for hydration as well as used to SSR the application/component.
 * @returns {string}
 */
export function ssr(name, app, { props, replacer, styles, mode = "open" } = {}) {
  assert(typeof name === "string", "SSR: 'name' argument must be a string");
  assert(["open", "closed"].includes(mode), "SSR: 'mode' argument must be either 'open' or 'closed'");
  const rendered = typeof app === "string" ? app : ReactDOM.renderToString(React.createElement(app, props));
  let stringifiedProps;
  if (props) {
    try {
      stringifiedProps = JSON.stringify(props, replacer);
    } catch (e) {
      throw new Error(`SSR: Props (${props}) were provided but stringify failed: Error message was: ${e.message}`);
    }
  }
  return `
<style>${name}:not(:defined) > template[shadowrootmode] ~ *  {opacity:0;visibility:hidden;}</style>
<${name}>
  <template shadowrootmode="${mode}">
    ${props ? `<script type="application/json">${stringifiedProps}</script>` : ''}
    ${styles ? `<style>${styles}</style>` : ''}
    <div id="${name}">${rendered}</div>
  </template>
</${name}>
<script>
  (function attachShadowRoots(root) {
    if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')) {
      root.querySelectorAll("template[shadowrootmode]").forEach(template => {
        const mode = template.getAttribute("shadowrootmode");
        const shadowRoot = template.parentNode.attachShadow({ mode });
        shadowRoot.appendChild(template.content);
        template.remove();
        attachShadowRoots(shadowRoot);
      });
    }
  })(document.currentScript.previousElementSibling);
</script>`;
}
