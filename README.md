# deps-walker

[![Build Status](https://travis-ci.org/sergei-startsev/deps-walker.svg?branch=master)](https://travis-ci.org/sergei-startsev/deps-walker)
[![Build status](https://ci.appveyor.com/api/projects/status/b622r5eccu8gid1l/branch/master?svg=true)](https://ci.appveyor.com/project/sergei-startsev/deps-walker/branch/master)

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