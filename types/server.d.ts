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
export function ssr(name: string, app: any, { props, replacer, styles, mode }?: SSROptions): string;
export type SSROptions = {
    /**
     * - Application props. These will be serialised and passed to the client for hydration as well as used to SSR the application/component.
     */
    props?: any;
    /**
     * - A function that transforms the results. This function is called for each member of the object. If a property is excluded then the value returned is null.
     */
    replacer?: any;
    /**
     * - Inline styling to be added to the shadow root.
     */
    styles?: string;
    /**
     * - The mode of the shadow root. Can be "open" or "closed". Defaults to "open".
     */
    mode?: string;
};
