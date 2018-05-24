/**
 * @file nodejs resolve
 */

const path = require('path');
const util = require('util');
const resolveAsync = util.promisify(require('resolve'));
const debug = require('debug')('deps-walker:nodejs-resolve');

function packageFilter(pkg) {
  if (pkg['jsnext:main']) {
    pkg['main'] = pkg['jsnext:main'];
  }
  return pkg;
}

async function resolve(filePath, contextPath, options) {
  const context = path.dirname(path.resolve(contextPath));
  let resolved = filePath;

  try {
    resolved = await resolveAsync(
      filePath,
      Object.assign(
        {
          extensions: ['.js', '.mjs', '.json', '.jsx', '.ts']
        },
        options,
        {
          basedir: context,
          packageFilter
        }
      )
    );
    debug(`${filePath} -> ${resolved} in ${context}`);
  } catch (e) {
    debug(`${filePath} is unresolved in ${context}`);
  }

  return resolved;
}

module.exports = resolve;
