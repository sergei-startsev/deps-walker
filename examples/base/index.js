const walk = require('../../lib')();
const path = require('path');

walk(path.resolve('entry.js'), (err, data) => {
  if (err) {
    // catch any errors...
    console.log(err);
    return;
  }
  const { filePath, dependencies } = data;
  // e.g. build dependency graph
  console.log(
    `${filePath}
        ${dependencies.length ? dependencies.join('\n\t') : 'no dependencies'}`
  );
});
