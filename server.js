import ReactDOM from "react-dom/server";
import React from "react";

/**
 * Server renders a React app/component and returns an HTML string ready for insertion into the DOM.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the client.
 * @param {React.FunctionComponent | React.ComponentClass | string} app - The React component/app to render.
 * @param {React.Attributes | null} props - Application props. These will be serialised and passed to the client for hydration as well as used to SSR the application/component.
 * @returns {string}
 */
export function ssr(name, app, props) {
  return `
    <${name}>
      <template shadowrootmode="open">
        <div id="${name}">${ReactDOM.renderToString(React.createElement(app, props))}</div>
      </template>
      <script>
        window.__REACT_DATA__ = window.__REACT_DATA__ || new Map();
        window.__REACT_DATA__.set('${name}', ${JSON.stringify(props)});
      </script>
    </${name}>`;
}

/**
 * Client side renders a React app/component and returns an HTML bootstrapping string ready for insertion into the DOM.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the client.
 * @param {React.Attributes | null} props - Application props. These will be serialised and passed to the client.
 * @returns {string}
 */
export function csr(name, props) {
  return `
    <script>
      window.__REACT_DATA__ = window.__REACT_DATA__ || new Map();
      window.__REACT_DATA__.set('${name}', ${JSON.stringify(props)});
    </script>
    <${name}></${name}>`;
}
