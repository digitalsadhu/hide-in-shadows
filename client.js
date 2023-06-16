import { hydrateRoot, createRoot } from "react-dom/client";
import React from "react";

/**
 * Hydrates an SSR'd React app on the client side by name and component. Expects ssr to be have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {React.FunctionComponent | React.ComponentClass | string} app - The React component/app to render.
 */
export function ssr(name, app) {
  customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super();
        if (this.shadowRoot) {
          const el = this.shadowRoot.querySelector(`#${name}`);
          // @ts-ignore
          const props = window.__REACT_DATA__.get(name);
          if (el) {
            hydrateRoot(el, React.createElement(app, props));
          }
        }
      }
    }
  );
}

/**
 * Client side renders a React app by name and component. Expects the function csr to have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {React.FunctionComponent | React.ComponentClass | string} app - The React component/app to render.
 */
export function csr(name, app) {
  customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const el = document.createElement('div');
        el.setAttribute('id', name);
        shadowRoot.appendChild(el);
          // @ts-ignore
        const props = window.__REACT_DATA__.get(name);
        createRoot(el).render(React.createElement(app, props));
      }
    }
  );
}