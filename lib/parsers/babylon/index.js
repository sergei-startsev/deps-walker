/**
 * @file babylon parse
 */

const babylon = require('babylon');
const debug = require('debug')('deps-walker:babylon-parse');

function parse(
  code,
  filePath,
  options = {
    sourceType: 'module'
  }
) {
  const dependencies = babylon
    .parse(code, options)
    .program.body.map(({ source }) => source)
    .filter(Boolean)
    .map(({ value }) => value);

  debug(`${filePath}: ${dependencies}`);
  return dependencies;
}

module.exports = parse;
