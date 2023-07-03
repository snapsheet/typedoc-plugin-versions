/**
 * Entry point for typedoc-plugin-versions
 *
 * @module
 */
import { Application } from 'typedoc';
import * as vUtils from './etc/utils';
import * as vHooks from './etc/hooks';
import { versionsOptions } from './types';
export * from './types';
/**
 * The default Typedoc [plugin hook](https://typedoc.org/guides/development/#plugins).
 * @param app
 */
export declare function load(app: Application): versionsOptions;
export { vUtils as utils, vHooks as hook };
//# sourceMappingURL=index.d.ts.map