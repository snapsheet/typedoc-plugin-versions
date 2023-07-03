"use strict";
/**
 * Entry point for typedoc-plugin-versions
 *
 * @module
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hook = exports.utils = exports.load = void 0;
const typedoc_1 = require("typedoc");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const vUtils = __importStar(require("./etc/utils"));
exports.utils = vUtils;
const vHooks = __importStar(require("./etc/hooks"));
exports.hook = vHooks;
__exportStar(require("./types"), exports);
/**
 * The default Typedoc [plugin hook](https://typedoc.org/guides/development/#plugins).
 * @param app
 */
function load(app) {
    app.options.addDeclaration({
        help: 'Options for typedoc-plugin-versions',
        name: 'versions',
        type: typedoc_1.ParameterType.Mixed,
        defaultValue: {
            stable: 'auto',
            dev: 'auto',
            domLocation: 'false',
        },
    });
    const vOptions = vUtils.getVersionsOptions(app);
    vHooks.injectSelectJs(app);
    vHooks.injectSelectHtml(app, vOptions.domLocation);
    const { rootPath, targetPath } = vUtils.getPaths(app);
    /**
     * This is the latest moment possible to inject the modified 'out' location
     * before typedoc freezes the options.
     */
    const originalReadOptions = app.options.read.bind(app.options);
    app.options.read = (logger) => {
        originalReadOptions(logger);
        targetPath && (app.options['_values']['out'] = targetPath);
    };
    /**
     * The documents have rendered and we now process directories into the select options
     * @event RendererEvent.END
     */
    app.renderer.on(typedoc_1.RendererEvent.END, () => {
        var _a, _b;
        vUtils.handleAssets(targetPath);
        vUtils.handleJeckyll(rootPath, targetPath);
        const metadata = vUtils.refreshMetadata(vUtils.loadMetadata(rootPath), rootPath, vOptions.stable, vOptions.dev);
        vUtils.makeAliasLink('stable', rootPath, (_a = metadata.stable) !== null && _a !== void 0 ? _a : metadata.dev);
        vUtils.makeAliasLink('dev', rootPath, (_b = metadata.dev) !== null && _b !== void 0 ? _b : metadata.stable);
        vUtils.makeMinorVersionLinks(metadata.versions, rootPath);
        const jsVersionKeys = vUtils.makeJsKeys(metadata);
        fs_extra_1.default.writeFileSync(path_1.default.join(rootPath, 'versions.js'), jsVersionKeys);
        fs_extra_1.default.writeFileSync(path_1.default.join(rootPath, 'index.html'), `<meta http-equiv="refresh" content="0; url=${metadata.stable ? 'stable/' : 'dev/'}"/>`);
        vUtils.saveMetadata(metadata, rootPath);
    });
    return vOptions;
}
exports.load = load;
//# sourceMappingURL=index.js.map