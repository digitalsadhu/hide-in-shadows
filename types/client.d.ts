/**
 * Hydrates an SSR'd React app on the client side by name and component. Expects ssr to be have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {React.FunctionComponent | React.ComponentClass | string} app - The React component/app to render.
 */
export function ssr(name: string, app: React.FunctionComponent | React.ComponentClass | string): void;
/**
 * Client side renders a React app by name and component. Expects the function csr to have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {React.FunctionComponent | React.ComponentClass | string} app - The React component/app to render.
 */
export function csr(name: string, app: React.FunctionComponent | React.ComponentClass | string): void;
