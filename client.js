import { hydrateRoot } from "react-dom/client";
import React from "react";

/**
 * @typedef {Object} HydrateOptions
 * @property {(this: any, key: string, value: any) => any} [reviver] - A function that transforms the results. This function is called for each member of the object. If a property is excluded then the value returned is null.
 */

/**
 * Hydrates an SSR'd React app on the client side by name and component. Expects ssr to be have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {any} app - The React component/app to render.
 * @param {HydrateOptions} [options] - Options object
 */
export function ssr(name, app, { reviver } = {}) {
  if (!customElements.get(name)) {
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
            if (data) {
              try {
                props = JSON.parse(data.textContent, reviver);
              } catch (e) {
                throw new Error(
                  `SSR: Props (${data.textContent}) were provided but parse failed: Error message was: ${e.message}`
                );
              }
            }
            const el = this.shadowRoot.querySelector(`#${name}`);
            if (el) {
              hydrateRoot(el, React.createElement(app, props));
            }
          }
        }
      }
    );
  }
}
