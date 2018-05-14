/**
 * @file deps-walker
 */

const fs = require('fs');
const util = require('util');

module.exports = function depsWalker(options) {
    const readFile = util.promisify(fs.readFile);
    const stat = util.promisify(fs.stat);
    const visited = new Set();

    // TODO implement default parse/resolve/ignore
    let { parse, resolve, ignore, cache } = options || {};

    async function traverse(entry, callback) {
        const traverseDeps = entry
            .filter(filePath => !visited.has(filePath))
            .filter(filePath => !ignore(filePath))
            .map(async filePath => {
                let code, dependencies = [];
                try {
                    visited.add(filePath);
                    const cached = await cache(filePath);
                    if (cached) {
                        dependencies = cached;
                    } else {
                        code = await readFile(filePath, 'utf8');
                        const { mtimeMs } = await stat(filePath);
                        dependencies = parse(code, filePath).map(dep => resolve(dep, filePath));
                        await cache(filePath, { mtimeMs, dependencies });
                    }
                } catch (e) {
                    callback(null, e);
                }

                callback({ filePath, dependencies });
                return await traverse(dependencies, callback);
            });

        return await Promise.all(traverseDeps);
    }

    async function walk(entry, callback) {
        if (!entry || (typeof entry !== 'string' && !Array.isArray(entry))) {
            throw new Error('entry should be a string or array ');
        }

        if (!callback || typeof callback !== 'function') {
            throw new Error('callback should be a function');
        }
        return await traverse(entry, callback);
    }

    walk.modules = visited;

    return walk;
};