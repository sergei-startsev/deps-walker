# deps-walker

```js

const walk = depsWalker({ resolve, parse, ignore, cache });

await walk(entryPoints, (module, e) => {
    if (e) {
        // logs error...
        return;
    }
    const { filePath, dependencies } = module;
    // e.g. builds dependency graph
});

```