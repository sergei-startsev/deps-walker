# deps-walker

```js

const walk = depsWalker({ resolve, parse, ignore, cache });

await walk(entryPoints, (err, module) => {
    if (e) {
        // logs error...
        return;
    }
    const { filePath, dependencies } = module;
    // e.g. builds dependency graph
});

```