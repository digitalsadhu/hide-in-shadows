import { hydrateRoot } from "react-dom/client";
import React from "react";

/**
 * Hydrates an SSR'd React app on the client side by name and component. Expects ssr to be have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {any} app - The React component/app to render.
 * @param {{ reviver?: any }} [options] - Options object
 */
export function ssr(name, app, { reviver } = {}) {
  customElements.define(
    name,
    class extends HTMLElement {
      constructor() {
        super();
        if (this.shadowRoot) {
          let props = {};
          const data = this.shadowRoot.querySelector(
            `script[type="application/json"]`
          );
          const el = this.shadowRoot.querySelector(`#${name}`);
          if (data) {
            props = JSON.parse(data.textContent, reviver);
          }
          if (el) {
            hydrateRoot(el, React.createElement(app, props));
          }
        }
      }
    }
  );
}
