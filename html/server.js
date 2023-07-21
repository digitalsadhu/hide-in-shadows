import assert from 'node:assert/strict';

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
  assert(["open", "closed"].includes(mode), "SSR: 'mode' argument must be either 'open' or 'closed'");
  return `
<style>${name}:not(:defined) > template[shadowrootmode] ~ *  {opacity:0;visibility:hidden;}</style>
<${name}>
  <template shadowrootmode="${mode}">
    ${markup}
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
