/**
 * Typdoc hooks and injections for typedoc-plugin-versions
 *
 * @module
 */
import { Application } from 'typedoc';
import { validLocation } from '../types';
/**
 * Injects browser js to control the behaviour of the new `select` DOM element
 * @param app
 */
export declare function injectSelectJs(app: Application): void;
/**
 * Injects the new `select` dropdown into the HTML
 * @param app
 * @param domLocation
 */
export declare function injectSelectHtml(app: Application, domLocation?: validLocation | string): void;
//# sourceMappingURL=hooks.d.ts.map