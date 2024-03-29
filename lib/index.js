/**
 * @file deps-walker
 */

const fs = require('graceful-fs');
const util = require('util');
const babelParse = require('./parsers/babel');
const nodejsResolve = require('./resolvers/nodejs');

module.exports = function depsWalker(options) {
  const readFile = util.promisify(fs.readFile);
  const visited = new Set();

  let { parse, resolve, ignore, cache, read } = options || {};

  parse = parse || babelParse;
  resolve = resolve || nodejsResolve;
  // cache isn't used by default
  cache = cache || (() => undefined);
  // disable ignoring by default
  ignore = ignore || (ignore = () => false);
  read = read || (filePath => readFile(filePath, 'utf8'));

  async function traverse(roots, visitor) {
    const traverseRoots = roots
      .filter(filePath => !visited.has(filePath))
      .filter(filePath => !ignore(filePath))
      .map(async filePath => {
        let dependencies;
        try {
          visited.add(filePath);
          dependencies = await cache(filePath);
          if (!dependencies) {
            const code = await read(filePath, 'utf8');
            dependencies = await Promise.all(
              parse(code, filePath).map(
                async dep => await resolve(dep, filePath)
              )
            );
            await cache(filePath, dependencies);
          }
        } catch (err) {
          visitor(err);
          return;
        }

        visitor(undefined, { filePath, dependencies });
        const result = await traverse(dependencies, visitor);
        return [{ filePath, dependencies }, ...(result?.flat() || [])];
      });

    return (await Promise.all(traverseRoots))?.flat();
  }

  /**
   * @callback visitor
   * @param {Object} error
   * @param {Object} data
   * @param {string} data.filePath - Module file path
   * @param {string[]} data.dependencies - Module dependencies paths
   */

  /**
   * Traverse ES6/ES2015 module dependency graph
   * @param {(string|string[])} entry - Entry points
   * @param {visitor} visitor - The visitor callback
   * @returns {Promise} Promise object can be used to await traverse completion
   */
  async function walk(entry, visitor) {
    if (typeof entry !== 'string' && !Array.isArray(entry)) {
      throw new Error('entry should be a string or array ');
    }

    if (typeof visitor !== 'function') {
      throw new Error('visitor should be a function');
    }

    if (typeof entry === 'string') {
      entry = [entry];
    }

    return await traverse(entry, visitor);
  }

  walk.modules = visited;

  return walk;
};
