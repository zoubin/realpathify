var resolver = require('..').realpathResolve;
var nodeResolve = require('resolve');
var test = require('tap').test;
var resolve = resolver(nodeResolve, ['local_module']);
var path = require('path');

function fixtures() {
    return path.resolve.bind(path, __dirname, 'fixtures').apply(null, arguments);
}

test('symlinked local_module', function(t) {
    t.plan(1);
    resolve('local_module', { basedir: fixtures() }, function (err, file) {
        t.equal(file, fixtures('local_module', 'index.js'));
    });
})

test('symlinked not in filter', function(t) {
    t.plan(1);
    resolve('not_in_filter', { basedir: fixtures() }, function (err, file) {
        t.equal(file, fixtures('node_modules', 'not_in_filter', 'index.js'));
    });
})

test('global_module', function(t) {
    t.plan(1);
    resolve('global_module', { basedir: fixtures() }, function (err, file) {
        t.equal(file, fixtures('node_modules', 'global_module', 'index.js'));
    });
})
