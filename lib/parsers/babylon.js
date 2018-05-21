/**
 * @file babylon parse
 */

const babylon = require('babylon');

function parse(
  code,
  filePath,
  options = {
    sourceType: 'module'
  }
) {
  return babylon
    .parse(code, options)
    .program.body.map(({ source }) => source)
    .filter(Boolean)
    .map(({ value }) => value);
}

module.exports = parse;
