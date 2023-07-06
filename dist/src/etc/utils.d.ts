/**
 * Static function utilities for typedoc-plugin-versions
 *
 * @module
 */
import { version, semanticAlias, versionsOptions, metadata } from '../types';
import { Application } from 'typedoc';
/**
 * Gets the docs metadata file path.
 * @param docRoot The path to the docs root.
 * @returns The metadata file path.
 */
export declare function getMetadataPath(docRoot: string): string;
/**
 * Loads the docs metadata file and retreives its data.
 * @param docRoot The path to the docs root.
 * @returns An object containing the docs metadata.
 */
export declare function loadMetadata(docRoot: string): metadata;
/**
 * Audits and updates a given {@link metadata} object.
 * @param metadata The metadata to refresh.
 * @param docRoot The path to the docs root.
 * @param [stable='auto'] The {@link version} set in the typedoc options for the 'stable' alias.
 * @param [dev='auto'] The {@link version} set in the options for the 'dev' alias.
 * @returns The refreshed {@link metadata}.
 */
export declare function refreshMetadata(metadata: metadata, docRoot: string, stable?: string, dev?: string): metadata;
/**
 * Audits an array of {@link version versions}, ensuring they all still exist, and adds newly found {@link version versions} to the array.
 * @param versions The array of {@link version versions} to refresh.
 * @param docRoot The path to the docs root.
 * @returns A distinct array of {@link version versions}, sorted in descending order.
 */
export declare function refreshMetadataVersions(versions: version[], docRoot: string): `v${string}`[];
/**
 * Refreshes a version {@link semanticAlias alias} (e.g. 'stable' or 'dev').
 * @param alias The {@link semanticAlias alias} to refresh.
 * @param versions An array of known, valid {@link version versions}.
 * @param [stable='auto'] The {@link version} set in the typedoc options for the 'stable' {@link semanticAlias alias}.
 * @param [dev='auto'] The {@link version} set in the options for the 'dev' {@link semanticAlias alias}.
 * @returns The refreshed {@link version} the {@link semanticAlias alias} should point to, or undefined if no match was found.
 */
export declare function refreshMetadataAlias(alias: semanticAlias, versions: version[], stable?: 'auto' | version, dev?: 'auto' | version): version;
/**
 * Saves a given {@link metadata} object to disk.
 * @param metadata The {@link metadata} object.
 * @param docRoot The path to the docs root.
 */
export declare function saveMetadata(metadata: metadata, docRoot: string): void;
/**
 * Gets the latest valid {@link version} for a given {@link semanticAlias alias}.
 * @param alias The {@link semanticAlias alias}.
 * @param versions An array of known, valid {@link version versions}.
 * @param [stable='auto'] The {@link version} set in the typedoc options for the 'stable' {@link semanticAlias alias}.
 * @param [dev='auto'] The {@link version} set in the options for the 'dev' {@link semanticAlias alias}.
 * @returns The latest matching {@link version}, or undefined if no match was found.
 */
export declare function getLatestVersion(alias: semanticAlias, versions: version[], stable?: 'auto' | version, dev?: 'auto' | version): version;
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
export declare function getVersionAlias(version?: string, stable?: 'auto' | version, dev?: 'auto' | version): semanticAlias;
/**
 * Gets the package version defined in package.json
 * @param version
 * @returns The package version
 */
export declare function getSemanticVersion(version?: string): version;
/**
 * Drops the patch from a semantic version string
 * @returns a minor version string in the for 0.0
 */
export declare function getMinorVersion(version?: string): version;
/**
 * Parses the root document directory for all semantically named sub-directories.
 * @param docRoot
 * @returns an array of directories
 */
export declare function getPackageDirectories(docRoot: string): string[];
/**
 * Gets a list of semantic versions from a list of directories.
 * @param directories An array of semantically named directories to be processed
 * @returns An array of {@link version versions}
 */
export declare function getVersions(directories: string[]): version[];
/**
 * Creates a string (of javascript) defining an array of all the versions to be included in the frontend select
 * @param metadata
 * @returns
 */
export declare function makeJsKeys(metadata: metadata): string;
/**
 * Creates a symlink for an alias
 * @param alias
 * @param docRoot
 * @param pegVersion
 */
export declare function makeAliasLink(alias: semanticAlias, docRoot: string, pegVersion: version): void;
/**
 * Creates symlinks for minor versions pointing to the latest patch release
 * @param semGroups
 * @param docRoot
 */
export declare function makeMinorVersionLinks(versions: version[], docRoot: string, stable?: 'auto' | version, dev?: 'auto' | version): void;
/**
 * Gets the {@link version} a given symlink is pointing to.
 * @param symlink The symlink path, relative to {@link docRoot}.
 * @param docRoot The path to the docs root.
 * @returns The version number parsed from the given symlink.
 */
export declare function getSymlinkVersion(symlink: string, docRoot: string): version;
/**
 * Workaround for [#2024](https://github.com/TypeStrong/typedoc/issues/2024)
 * @param app
 * @returns correctly overridden options
 */
export declare function getVersionsOptions(app: Application): versionsOptions;
/**
 * Resolve the root document path and document build path
 * @param app
 * @param version
 * @returns the paths
 */
export declare function getPaths(app: Application, version?: version): {
    rootPath: string;
    targetPath: string;
};
/**
 * Moves .nojeckyll flag file to the documentation root folder
 * @param rootPath
 * @param targetPath
 */
export declare function handleJeckyll(rootPath: string, targetPath: string): void;
/**
 * Copies static assets to the document build folder
 * @param targetPath
 */
export declare function handleAssets(targetPath: string, srcDir?: string): void;
/**
 * Regex for matching semantic patch version
 */
export declare const verRegex: RegExp;
/**
 * regex for matching semantic minor version
 */
export declare const minorVerRegex: RegExp;
//# sourceMappingURL=utils.d.ts.map