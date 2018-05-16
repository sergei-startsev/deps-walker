# deps-walker

[![Build Status](https://travis-ci.org/sergei-startsev/deps-walker.svg?branch=master)](https://travis-ci.org/sergei-startsev/deps-walker)

```js

const walk = depsWalker({ resolve, parse, ignore, cache });

await walk(entryPoints, (err, module) => {
    if (err) {
        // logs error...
        return;
    }
    const { filePath, dependencies } = module;
    // e.g. builds dependency graph
});

```