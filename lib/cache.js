/**
 * @file deps-walker cache
 */

const fs = require('graceful-fs');
const path = require('path');
const util = require('util');
const mkdirp = util.promisify(require('mkdirp'));

const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
const writeFile = util.promisify(fs.writeFile);

async function cache(filePath, dependencies) {
  const { mtimeMs: mtime } = await stat(filePath);
  if (!dependencies) {
    const cached = cache.map.get(filePath);
    if (cached && cached.mtime === mtime) {
      return cached.dependencies;
    }
  } else {
    cache.map.set(filePath, { dependencies, mtime });
  }
}

cache.map = new Map();

cache.load = async function (filePath) {
  try {
    const json = await readFile(filePath, 'utf8');
    cache.map = new Map(JSON.parse(json));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
};

cache.save = async function (filePath) {
  await mkdirp(path.dirname(filePath));
  await writeFile(filePath, JSON.stringify(Array.from(cache.map)));
};

cache.reset = function () {
  cache.map = new Map();
};

module.exports = cache;
