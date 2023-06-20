import ReactDOM from "react-dom/server";
import React from "react";

/**
 * @typedef {Object} SSROptions
 * @property {any} [props] - Application props. These will be serialised and passed to the client for hydration as well as used to SSR the application/component.
 * @property {any} [replacer] - A function that transforms the results. This function is called for each member of the object. If a property is excluded then the value returned is null.
 * @property {string} [styles] - Inline styling to be added to the shadow root.
 * @property {string} [mode] - The mode of the shadow root. Can be "open" or "closed". Defaults to "open".
 */

/**
 * Server renders a React app/component and returns an HTML string ready for insertion into the DOM.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the client.
 * @param {any} app - The React component/app to render.
 * @param {SSROptions} [options] - Application props. These will be serialised and passed to the client for hydration as well as used to SSR the application/component.
 * @returns {string}
 */
export function ssr(name, app, { props, replacer, styles, mode = "open" } = {}) {
  return `
<style>${name}:not(:defined) > template[shadowrootmode] ~ *  { display: none; }</style>
<${name}>
  <template shadowrootmode="${mode}">
    ${props ? `<script type="application/json">${JSON.stringify(props, replacer)}</script>` : ''}
    ${styles ? `<style>${styles}</style>` : ''}
    <div id="${name}">${ReactDOM.renderToString(React.createElement(app, props ? props : null))}</div>
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

/**
 * Client side renders a React app/component and returns an HTML bootstrapping string ready for insertion into the DOM.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the client.
 * @param {React.Attributes | null} props - Application props. These will be serialised and passed to the client.
 * @returns {string}
 */
export function csr(name, props) {
  return `<script>
  window.__REACT_DATA__ = window.__REACT_DATA__ || new Map();
  window.__REACT_DATA__.set('${name}', ${JSON.stringify(props)});
</script>
<${name}></${name}>`;
}
