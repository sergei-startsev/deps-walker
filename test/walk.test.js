const path = require('path');
const depsWalker = require('../lib');

const convertToRelative = filePath =>
  filePath
    .toLowerCase()
    .replace(path.resolve(__dirname, '..').toLowerCase(), '.')
    .replace(/\\/g, '/');

describe('walker', function () {
  it('should traverse an entry with default configuration', async function () {
    const walk = depsWalker();

    const graph = await walk(
      path.resolve('./examples/base/entry.js'),
      () => {}
    );

    const expected = graph.map(({ filePath, dependencies }) => {
      filePath = convertToRelative(filePath);
      dependencies = dependencies.map(convertToRelative);
      return { filePath, dependencies };
    });
    expect(expected).toMatchSnapshot();
  });

  it('should traverse several entries with default configuration', async function () {
    const walk = depsWalker();

    const graph = await walk(
      [
        path.resolve('./examples/base/a.js'),
        path.resolve('./examples/base/entry.js')
      ],
      () => {}
    );
    const expected = graph.map(({ filePath, dependencies }) => {
      filePath = convertToRelative(filePath);
      dependencies = dependencies.map(convertToRelative);
      return { filePath, dependencies };
    });
    expect(expected).toMatchSnapshot();
  });
});
