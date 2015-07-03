# realpathify
plugin for browserify to resolve symlink to realpath, to make transforms work for symlinked local modules

substack has recommended a nice way of organizing your local modules in [browserify-handbook](https://github.com/substack/browserify-handbook#symlink).

However, transforms applied in browserify won't work on modules whose [resolve]()d paths containing `node_modules` by default. So, if you symlinked your local modules in `node_modules`, you probably have to figure out some way to make transforms applied to them.

This module presents a way to do that, by hacking `b._bresolve`, to make it resolve symlinked directories in `node_modules` to their real paths, so `module-deps` won't treat them as global modules.

## Usage

```javascript
var b = browserify(bOpts);
var realpathify = require('realpathify');
b.plugin(realpathify, { filter: ['local_module'] });

```

## b.plugin(realpathify, opts)

### opts

#### filter

Type: `String`, `Array`

`Optional`

If you specified this the `filter` option, then only those directories contained in it will be realpathified. It makes `realpathify` work more fast.

If not specified, `realpathify` will try to resolve all subdirectories in `node_modules`.
