/**
 * @file deps-walker
 */

const fs = require('fs');
const util = require('util');

module.exports = function depsWalker(options) {
  const readFile = util.promisify(fs.readFile);
  const visited = new Set();

  // TODO implement default parse/resolve/ignore
  let { parse, resolve, ignore, cache } = options || {};

  if (!cache) {
    // stub
    cache = () => undefined;
  }

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
            const code = await readFile(filePath, 'utf8');
            dependencies = parse(code, filePath).map(dep =>
              resolve(dep, filePath)
            );
            await cache(filePath, dependencies);
          }
        } catch (err) {
          visitor(err);
          return;
        }

        visitor(undefined, { filePath, dependencies });
        return await traverse(dependencies, visitor);
      });

    return await Promise.all(traverseRoots);
  }

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
