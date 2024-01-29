const path = require('path');
const depsWalker = require('../lib');

const convertToRelative = filePath =>
  filePath
    .toLowerCase()
    .replace(path.resolve(__dirname, '..').toLowerCase(), '.')
    .replace(/\\/g, '/');

const sort = graph =>
  graph.sort((a, b) => a.filePath.localeCompare(b.filePath));

describe('walker', function () {
  it('should traverse an entry with default configuration', async function () {
    const walk = depsWalker();

    const graph = await walk(
      path.join(__dirname, 'examples/base/entry.js'),
      () => {}
    );

    const expected = sort(
      graph.map(({ filePath, dependencies }) => {
        filePath = convertToRelative(filePath);
        dependencies = dependencies.map(convertToRelative);
        return { filePath, dependencies };
      })
    );
    expect(expected).toMatchSnapshot();
  });

  it('should traverse several entries with default configuration', async function () {
    const walk = depsWalker();

    const graph = await walk(
      [
        path.join(__dirname, 'examples/base/a.js'),
        path.join(__dirname, 'examples/base/entry.js')
      ],
      () => {}
    );

    const expected = sort(
      graph.map(({ filePath, dependencies }) => {
        filePath = convertToRelative(filePath);
        dependencies = dependencies.map(convertToRelative);
        return { filePath, dependencies };
      })
    );
    expect(expected).toMatchSnapshot();
  });
});
