/**
 * Hydrates an SSR'd React app on the client side by name and component. Expects ssr to be have been called on the server.
 * @param {string} name - The name of the app. Lower case characters and "-" character only. This value will be used as the custom element name. Must match the name used on the server.
 * @param {any} app - The React component/app to render.
 * @param {{ reviver?: any }} [options] - Options object
 */
export function ssr(name: string, app: any, { reviver }?: {
    reviver?: any;
}): void;
