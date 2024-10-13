"use strict";
// https://gist.github.com/ds300/f6177171ac673f98f6028799563a06db#file-add-extensions-ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJsExtensions = addJsExtensions;
const fs_1 = require("fs");
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const recast_1 = require("recast");
const extensions = ['.js', '.mjs', '.cjs'];
function resolveRelativePath(importingFile, relativePath) {
    if (!relativePath.startsWith('.')) {
        return relativePath;
    }
    const containingDir = path_1.default.dirname(importingFile);
    if ((0, fs_1.existsSync)(path_1.default.join(containingDir, relativePath)) &&
        !(0, fs_1.statSync)(path_1.default.join(containingDir, relativePath)).isDirectory()) {
        // if the file already exists, e.g. .css files, just use it
        return relativePath;
    }
    // strip the file extension if applicable
    relativePath.replace(/\.(m|c)?js$/, '');
    for (const extension of extensions) {
        if (relativePath.endsWith(extension)) {
            return relativePath;
        }
        else {
            let candidate = `${relativePath}${extension}`;
            if ((0, fs_1.existsSync)(path_1.default.join(containingDir, candidate))) {
                return candidate;
            }
            candidate = `${relativePath}/index${extension}`;
            if ((0, fs_1.existsSync)(path_1.default.join(containingDir, candidate))) {
                return candidate;
            }
        }
    }
    throw new Error(`Could not resolve relative path ${relativePath} from ${importingFile}`);
}
function addJsExtensions(distDir) {
    for (const file of glob_1.default.sync(path_1.default.join(distDir, '**/*.{mjs,cjs,js}'))) {
        const code = (0, recast_1.parse)((0, fs_1.readFileSync)(file, 'utf8'), { parser: require('recast/parsers/typescript') });
        (0, recast_1.visit)(code, {
            visitImportDeclaration(path) {
                path.value.source.value = resolveRelativePath(file, path.value.source.value);
                return false;
            },
            visitExportAllDeclaration(path) {
                path.value.source.value = resolveRelativePath(file, path.value.source.value);
                return false;
            },
            visitExportNamedDeclaration(path) {
                if (path.value.source) {
                    path.value.source.value = resolveRelativePath(file, path.value.source.value);
                }
                return false;
            },
        });
        (0, fs_1.writeFileSync)(file, (0, recast_1.print)(code).code);
    }
}
//# sourceMappingURL=addExtension.js.map