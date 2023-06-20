import { hydrateRoot, createRoot } from "react-dom/client";
import React from "react";

/**
 * Hydrates an SSR'd React app on the client side by name and component. Expects ssr to be have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {any} app - The React component/app to render.
 * @param {any} [reviver] - A function that transforms data serialized by ssr.
 */
export function ssr(name, app, reviver) {
  customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super();
        if (this.shadowRoot) {
          const data = this.shadowRoot.querySelector(`script[type="application/json"]`);
          const el = this.shadowRoot.querySelector(`#${name}`);
          // @ts-ignore
          const props = JSON.parse(data.textContent, reviver);
          if (el) {
            hydrateRoot(el, React.createElement(app, props));
          }
        }
      }
    }
  );
}

/**
 * Client side renders a React app by name and component. Expects the function csr to have been called on the server side.
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