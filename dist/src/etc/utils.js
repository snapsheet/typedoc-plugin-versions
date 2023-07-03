"use strict";
/**
 * Static function utilities for typedoc-plugin-versions
 *
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minorVerRegex = exports.verRegex = exports.handleAssets = exports.handleJeckyll = exports.getPaths = exports.getVersionsOptions = exports.getSymlinkVersion = exports.makeMinorVersionLinks = exports.makeAliasLink = exports.makeJsKeys = exports.getVersions = exports.getPackageDirectories = exports.getMinorVersion = exports.getSemanticVersion = exports.getVersionAlias = exports.getLatestVersion = exports.saveMetadata = exports.refreshMetadataAlias = exports.refreshMetadataVersions = exports.refreshMetadata = exports.loadMetadata = exports.getMetadataPath = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const semver_1 = __importDefault(require("semver"));
const typedoc_1 = require("typedoc");
const packagePath = path_1.default.join(process.cwd(), 'package.json');
const pack = fs_extra_1.default.readJSONSync(packagePath);
/**
 * Gets the docs metadata file path.
 * @param docRoot The path to the docs root.
 * @returns The metadata file path.
 */
function getMetadataPath(docRoot) {
    return path_1.default.join(docRoot, '.typedoc-plugin-versions');
}
exports.getMetadataPath = getMetadataPath;
/**
 * Loads the docs metadata file and retreives its data.
 * @param docRoot The path to the docs root.
 * @returns An object containing the docs metadata.
 */
function loadMetadata(docRoot) {
    try {
        return fs_extra_1.default.readJsonSync(getMetadataPath(docRoot));
    }
    catch (_a) {
        return {};
    }
}
exports.loadMetadata = loadMetadata;
/**
 * Audits and updates a given {@link metadata} object.
 * @param metadata The metadata to refresh.
 * @param docRoot The path to the docs root.
 * @param [stable='auto'] The {@link version} set in the typedoc options for the 'stable' alias.
 * @param [dev='auto'] The {@link version} set in the options for the 'dev' alias.
 * @returns The refreshed {@link metadata}.
 */
function refreshMetadata(metadata, docRoot, stable = 'auto', dev = 'auto') {
    var _a;
    const validate = (v) => (v === 'auto' ? v : getSemanticVersion(v));
    const vStable = validate(stable);
    const vDev = validate(dev);
    const versions = refreshMetadataVersions([...((_a = metadata.versions) !== null && _a !== void 0 ? _a : []), metadata.stable, metadata.dev], docRoot);
    return {
        versions,
        stable: refreshMetadataAlias('stable', versions, vStable, vDev),
        dev: refreshMetadataAlias('dev', versions, vStable, vDev),
    };
}
exports.refreshMetadata = refreshMetadata;
/**
 * Audits an array of {@link version versions}, ensuring they all still exist, and adds newly found {@link version versions} to the array.
 * @param versions The array of {@link version versions} to refresh.
 * @param docRoot The path to the docs root.
 * @returns A distinct array of {@link version versions}, sorted in descending order.
 */
function refreshMetadataVersions(versions, docRoot) {
    return ([
        // metadata versions
        ...versions
            // filter down to directories that still exist
            .filter((version) => {
            try {
                const vPath = path_1.default.join(docRoot, version);
                return (fs_extra_1.default.pathExistsSync(vPath) &&
                    fs_extra_1.default.statSync(vPath).isDirectory() &&
                    semver_1.default.valid(version, true) !== null);
            }
            catch (_a) {
                return false; // discard undefined values
            }
        })
            // ensure consistent format
            .map((version) => getSemanticVersion(version)),
        // also include any other semver directories that exist in docs
        ...getVersions(getPackageDirectories(docRoot)),
        // package.json version
        getSemanticVersion(),
        // stable and dev symlinks
        getSymlinkVersion('stable', docRoot),
        getSymlinkVersion('dev', docRoot),
    ]
        // discard undefined && filter to unique values only
        .filter((v, i, s) => v !== undefined && s.indexOf(v) === i)
        // sort in descending order
        .sort(semver_1.default.rcompare));
}
exports.refreshMetadataVersions = refreshMetadataVersions;
/**
 * Refreshes a version {@link semanticAlias alias} (e.g. 'stable' or 'dev').
 * @param alias The {@link semanticAlias alias} to refresh.
 * @param versions An array of known, valid {@link version versions}.
 * @param [stable='auto'] The {@link version} set in the typedoc options for the 'stable' {@link semanticAlias alias}.
 * @param [dev='auto'] The {@link version} set in the options for the 'dev' {@link semanticAlias alias}.
 * @returns The refreshed {@link version} the {@link semanticAlias alias} should point to, or undefined if no match was found.
 */
function refreshMetadataAlias(alias, versions, stable = 'auto', dev = 'auto') {
    const option = alias === 'stable' ? stable : dev;
    if (option && // the option is set
        option !== 'auto' && // option is not 'auto'
        versions.includes(getSemanticVersion(option)) // the version set in the option exists in the known versions
    ) {
        return getSemanticVersion(option); // user has explicitly specified a valid version, use it
    }
    else {
        const latest = getLatestVersion(alias, versions, stable, dev); // in auto mode, get latest version for the alias
        if (latest && // return undefined if latest version not set for alias
            (alias !== 'dev' || // when alias is dev, only return latest dev if >= latest stable
                !getLatestVersion('stable', versions, stable, dev) || // or there is no matching latest stable
                semver_1.default.gte(latest, getLatestVersion('stable', versions, stable, dev), true))) {
            return getSemanticVersion(latest);
        }
    }
}
exports.refreshMetadataAlias = refreshMetadataAlias;
/**
 * Saves a given {@link metadata} object to disk.
 * @param metadata The {@link metadata} object.
 * @param docRoot The path to the docs root.
 */
function saveMetadata(metadata, docRoot) {
    fs_extra_1.default.writeJsonSync(getMetadataPath(docRoot), metadata);
}
exports.saveMetadata = saveMetadata;
/**
 * Gets the latest valid {@link version} for a given {@link semanticAlias alias}.
 * @param alias The {@link semanticAlias alias}.
 * @param versions An array of known, valid {@link version versions}.
 * @param [stable='auto'] The {@link version} set in the typedoc options for the 'stable' {@link semanticAlias alias}.
 * @param [dev='auto'] The {@link version} set in the options for the 'dev' {@link semanticAlias alias}.
 * @returns The latest matching {@link version}, or undefined if no match was found.
 */
function getLatestVersion(alias, versions, stable = 'auto', dev = 'auto') {
    return [...versions]
        .sort(semver_1.default.rcompare)
        .find((v) => getVersionAlias(v, stable, dev) === alias);
}
exports.getLatestVersion = getLatestVersion;
/**
 * Gets the {@link semanticAlias alias} of the given version, e.g. 'stable' or 'dev'.
 * @remarks
 * Versions {@link https://semver.org/#spec-item-4 lower than 1.0.0} or
 * {@link https://semver.org/#spec-item-9 with a pre-release label} (e.g. 1.0.0-alpha.1)
 * will be considered 'dev'. All other versions will be considered 'stable'.
 * @param [version] Defaults to the version from `package.json`
 * @param [stable='auto'] The {@link version} set in the typedoc options for the 'stable' alias.
 * @param [dev='auto'] The {@link version} set in the options for the 'dev' alias.
 * @returns The {@link semanticAlias alias} of the given version.
 */
function getVersionAlias(version, stable = 'auto', dev = 'auto') {
    version = getSemanticVersion(version);
    if (stable !== 'auto' && version === getSemanticVersion(stable))
        // version is marked as stable by user
        return 'stable';
    else if (dev !== 'auto' && version === getSemanticVersion(dev))
        // version is marked as dev by user
        return 'dev';
    // semver.satisfies() automatically filters out prerelease versions by default
    else
        return semver_1.default.satisfies(version, '>=1.0.0', true) ? 'stable' : 'dev';
}
exports.getVersionAlias = getVersionAlias;
/**
 * Gets the package version defined in package.json
 * @param version
 * @returns The package version
 */
function getSemanticVersion(version = pack.version) {
    if (!version) {
        throw new Error('Package version was not found');
    }
    const semVer = semver_1.default.coerce(version, { loose: true });
    if (!semVer) {
        throw new Error(`version is not semantically formatted: ${version}`);
    }
    // ensure prerelease info remains appended
    const prerelease = semver_1.default.prerelease(version, true);
    return prerelease
        ? `v${semVer.version}-${semver_1.default.prerelease(version, true).join('.')}`
        : `v${semVer.version}`;
}
exports.getSemanticVersion = getSemanticVersion;
/**
 * Drops the patch from a semantic version string
 * @returns a minor version string in the for 0.0
 */
function getMinorVersion(version) {
    version = getSemanticVersion(version);
    const { major, minor } = semver_1.default.coerce(version, { loose: true });
    return `v${major}.${minor}`;
}
exports.getMinorVersion = getMinorVersion;
/**
 * Parses the root document directory for all semantically named sub-directories.
 * @param docRoot
 * @returns an array of directories
 */
function getPackageDirectories(docRoot) {
    return fs_extra_1.default.readdirSync(docRoot).filter((file) => {
        const filePath = path_1.default.join(docRoot, file);
        return (fs_extra_1.default.pathExistsSync(filePath) &&
            fs_extra_1.default.statSync(filePath).isDirectory() &&
            semver_1.default.valid(file, true) !== null);
    });
}
exports.getPackageDirectories = getPackageDirectories;
/**
 * Gets a list of semantic versions from a list of directories.
 * @param directories An array of semantically named directories to be processed
 * @returns An array of {@link version versions}
 */
function getVersions(directories) {
    return directories
        .filter((dir) => semver_1.default.coerce(dir, { loose: true }))
        .map((dir) => getSemanticVersion(dir));
}
exports.getVersions = getVersions;
/**
 * Creates a string (of javascript) defining an array of all the versions to be included in the frontend select
 * @param metadata
 * @returns
 */
function makeJsKeys(metadata) {
    const alias = metadata.stable ? 'stable' : 'dev';
    const keys = [
        alias,
        ...metadata.versions // add the major.minor versions
            .map((v) => getMinorVersion(v))
            .filter((v, i, s) => s.indexOf(v) === i),
    ];
    if (alias !== 'dev' && metadata.dev) {
        keys.push('dev');
    }
    // finally, create the js string
    const lines = [
        '"use strict"',
        'export const DOC_VERSIONS = [',
        ...keys.map((v) => `	'${v}',`),
        '];',
    ];
    return lines.join('\n').concat('\n');
}
exports.makeJsKeys = makeJsKeys;
/**
 * Creates a symlink for an alias
 * @param alias
 * @param docRoot
 * @param pegVersion
 */
function makeAliasLink(alias, docRoot, pegVersion) {
    var _a;
    pegVersion = getSemanticVersion(pegVersion);
    const stableSource = path_1.default.join(docRoot, pegVersion);
    if (!fs_extra_1.default.pathExistsSync(stableSource))
        throw new Error(`Document directory does not exist: ${pegVersion}`);
    const stableTarget = path_1.default.join(docRoot, alias);
    if ((_a = fs_extra_1.default.lstatSync(stableTarget, { throwIfNoEntry: false })) === null || _a === void 0 ? void 0 : _a.isSymbolicLink())
        fs_extra_1.default.unlinkSync(stableTarget);
    fs_extra_1.default.ensureSymlinkSync(stableSource, stableTarget, 'junction');
}
exports.makeAliasLink = makeAliasLink;
/**
 * Creates symlinks for minor versions pointing to the latest patch release
 * @param semGroups
 * @param docRoot
 */
function makeMinorVersionLinks(versions, docRoot, stable = 'auto', dev = 'auto') {
    var _a;
    for (const version of versions
        // get highest patch per version
        .map((version) => {
        // prefer stable where available
        const highestStablePatch = versions.find((v) => getVersionAlias(v, stable, dev) === 'stable' &&
            semver_1.default.satisfies(v, `${semver_1.default.major(version)}.${semver_1.default.minor(version)}.x`, { includePrerelease: true }));
        // fallback to highest patch
        return (highestStablePatch !== null && highestStablePatch !== void 0 ? highestStablePatch : versions.find((v) => semver_1.default.satisfies(v, `${semver_1.default.major(version)}.${semver_1.default.minor(version)}.x`, { includePrerelease: true })));
    })
        // filter to unique values
        .filter((v, i, s) => s.indexOf(v) === i)) {
        const target = path_1.default.join(docRoot, getMinorVersion(version));
        const src = path_1.default.join(docRoot, version);
        if ((_a = fs_extra_1.default.lstatSync(target, { throwIfNoEntry: false })) === null || _a === void 0 ? void 0 : _a.isSymbolicLink())
            fs_extra_1.default.unlinkSync(target);
        fs_extra_1.default.ensureSymlinkSync(src, target, 'junction');
    }
}
exports.makeMinorVersionLinks = makeMinorVersionLinks;
/**
 * Gets the {@link version} a given symlink is pointing to.
 * @param symlink The symlink path, relative to {@link docRoot}.
 * @param docRoot The path to the docs root.
 * @returns The version number parsed from the given symlink.
 */
function getSymlinkVersion(symlink, docRoot) {
    const symlinkPath = path_1.default.join(docRoot, symlink);
    if (fs_extra_1.default.pathExistsSync(symlinkPath) &&
        fs_extra_1.default.lstatSync(symlinkPath).isSymbolicLink()) {
        const targetPath = fs_extra_1.default.readlinkSync(symlinkPath);
        if (fs_extra_1.default.pathExistsSync(targetPath) &&
            fs_extra_1.default.statSync(targetPath).isDirectory()) {
            // retrieve the version the symlink is pointing to
            return getSemanticVersion(path_1.default.basename(targetPath));
        }
    }
}
exports.getSymlinkVersion = getSymlinkVersion;
/**
 * Workaround for [#2024](https://github.com/TypeStrong/typedoc/issues/2024)
 * @param app
 * @returns correctly overridden options
 */
function getVersionsOptions(app) {
    const defaultOpts = app.options.getValue('versions');
    app.options.addReader(new typedoc_1.TypeDocReader());
    app.options.read(new typedoc_1.Logger());
    const options = app.options.getValue('versions');
    return Object.assign(Object.assign({}, defaultOpts), options);
}
exports.getVersionsOptions = getVersionsOptions;
/**
 * Resolve the root document path and document build path
 * @param app
 * @param version
 * @returns the paths
 */
function getPaths(app, version) {
    const defaultRootPath = path_1.default.join(process.cwd(), 'docs');
    const rootPath = app.options.getValue('out') || defaultRootPath;
    return {
        rootPath,
        targetPath: path_1.default.join(rootPath, getSemanticVersion(version)),
    };
}
exports.getPaths = getPaths;
/**
 * Moves .nojeckyll flag file to the documentation root folder
 * @param rootPath
 * @param targetPath
 */
function handleJeckyll(rootPath, targetPath) {
    const srcJeckPath = path_1.default.join(targetPath, '.nojekyll');
    const targetJeckPath = path_1.default.join(rootPath, '.nojekyll');
    fs_extra_1.default.existsSync(targetJeckPath) && fs_extra_1.default.removeSync(targetJeckPath);
    fs_extra_1.default.existsSync(srcJeckPath) && fs_extra_1.default.moveSync(srcJeckPath, targetJeckPath);
}
exports.handleJeckyll = handleJeckyll;
/**
 * Copies static assets to the document build folder
 * @param targetPath
 */
function handleAssets(targetPath, srcDir = __dirname) {
    const sourceAsset = path_1.default.join(srcDir, '../assets/versionsMenu.js');
    fs_extra_1.default.ensureDirSync(path_1.default.join(targetPath, 'assets'));
    fs_extra_1.default.copyFileSync(sourceAsset, path_1.default.join(targetPath, 'assets/versionsMenu.js'));
}
exports.handleAssets = handleAssets;
/**
 * Regex for matching semantic patch version
 */
exports.verRegex = /^(v\d+|\d+).\d+.\d+/;
/**
 * regex for matching semantic minor version
 */
exports.minorVerRegex = /^(v\d+|\d+).\d+$/;
//# sourceMappingURL=utils.js.map