/**
 * @file babel parse
 */

const parser = require('@babel/parser');
const debug = require('debug')('deps-walker:babel-parse');

function parse(
  code,
  filePath,
  options = {
    sourceType: 'module'
  }
) {
  const dependencies = parser
    .parse(code, options)
    .program.body.map(({ source }) => source)
    .filter(Boolean)
    .map(({ value }) => value);

  debug(`${filePath}: ${dependencies}`);
  return dependencies;
}

module.exports = parse;
