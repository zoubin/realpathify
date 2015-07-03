var realpathify = require('..');
var nodeResolve = require('resolve');
var test = require('tap').test;
var resolve = realpathify.async(nodeResolve, ['local_module']);
resolve.sync = realpathify.sync(nodeResolve.sync, ['local_module']);
var path = require('path');
var realpath = realpathify.realpath;

function fixtures() {
    return path.resolve.bind(path, __dirname, 'fixtures').apply(null, arguments);
}

test('async', function(t) {
    t.plan(3);
    resolve('local_module', { basedir: fixtures() }, function (err, file) {
        t.equal(
            file,
            fixtures('local_module', 'index.js'),
            'local_module'
        );
    });
    resolve('not_in_filter', { basedir: fixtures() }, function (err, file) {
        t.equal(
            file,
            fixtures('node_modules', 'not_in_filter', 'index.js'),
            'not_in_filter'
        );
    });
    resolve('global_module', { basedir: fixtures() }, function (err, file) {
        t.equal(
            file,
            fixtures('node_modules', 'global_module', 'index.js'),
            'global_module'
        );
    });
})

test('sync', function(t) {
    t.equal(
        resolve.sync('local_module', { basedir: fixtures() }),
        fixtures('local_module', 'index.js'),
        'local_module'
    );
    t.equal(
        resolve.sync('not_in_filter', { basedir: fixtures() }),
        fixtures('node_modules', 'not_in_filter', 'index.js'),
        'not_in_filter'
    );
    t.equal(
        resolve.sync('global_module', { basedir: fixtures() }),
        fixtures('node_modules', 'global_module', 'index.js'),
        'global_module'
    );
    t.end();
})

test('realpath', function(t) {
    t.equal(
        realpath(fixtures('node_modules', 'local_module', 'index.js')),
        fixtures('local_module', 'index.js'),
        'local_module'
    );
    t.equal(
        realpath(fixtures('node_modules', 'not_in_filter', 'index.js'), ['local_module']),
        fixtures('node_modules', 'not_in_filter', 'index.js'),
        'not_in_filter'
    );
    t.equal(
        realpath(fixtures('node_modules', 'global_module', 'index.js')),
        fixtures('node_modules', 'global_module', 'index.js'),
        'global_module'
    );
})
