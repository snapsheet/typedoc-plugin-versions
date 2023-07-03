"use strict";
/**
 * Typdoc hooks and injections for typedoc-plugin-versions
 *
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectSelectHtml = exports.injectSelectJs = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typedoc_1 = require("typedoc");
/**
 * Injects browser js to control the behaviour of the new `select` DOM element
 * @param app
 */
function injectSelectJs(app) {
    app.renderer.hooks.on('body.end', (ctx) => {
        return (typedoc_1.JSX.createElement("script", { src: ctx.relativeURL('assets/versionsMenu.js'), type: "module" }));
    });
}
exports.injectSelectJs = injectSelectJs;
const validHookLocations = [
    'body.begin',
    'body.end',
    'content.begin',
    'content.end',
    'navigation.begin',
    'navigation.end',
];
/**
 * Injects the new `select` dropdown into the HTML
 * @param app
 * @param domLocation
 */
function injectSelectHtml(app, domLocation = 'false') {
    if (validHookLocations.indexOf(domLocation) > -1) {
        app.renderer.hooks.on(domLocation, () => (typedoc_1.JSX.createElement("select", { id: "plugin-versions-select", name: "versions" })));
    }
    else {
        app.renderer.hooks.on('body.begin', () => (typedoc_1.JSX.createElement("select", { id: "plugin-versions-select", class: "title", name: "versions" })));
    }
}
exports.injectSelectHtml = injectSelectHtml;
//# sourceMappingURL=hooks.js.map