/**
 * Server renders a React app/component and returns an HTML string ready for insertion into the DOM.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the client.
 * @param {React.FunctionComponent | React.ComponentClass | string} app - The React component/app to render.
 * @param {object} props - Application props. These will be serialised and passed to the client for hydration as well as used to SSR the application/component.
 * @returns {string}
 */
export function ssr(name: string, app: React.FunctionComponent | React.ComponentClass | string, props: object): string;
/**
 * Client side renders a React app/component and returns an HTML bootstrapping string ready for insertion into the DOM.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the client.
 * @param {React.Attributes | null} props - Application props. These will be serialised and passed to the client.
 * @returns {string}
 */
export function csr(name: string, props: React.Attributes | null): string;
