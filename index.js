var fs = require('fs');
var shimify = require('resolve-shimify');

module.exports = function (b, opts) {
    opts = opts || {};
    var cache = {};
    b.plugin(shimify, function (id) {
        return realpath(id, opts.filter, cache);
    })
    .on('reset', function () {
        cache = {};
    });
};

module.exports.async = async;
module.exports.sync = sync;
module.exports.realpath = realpath;

function async(resolve, filter) {
    var cache = {};
    return function (id, parent, cb) {
        resolve(id, parent, function (err, file, pkg) {
            if (err) {
                return cb(err, file, pkg);
            }
            return cb(err, realpath(file, filter, cache), pkg);
        });
    };
}

function sync(resolve, filter) {
    var cache = {};
    return function (id, parent) {
        return realpath(resolve(id, parent), filter, cache);
    };
}

function realpath(file, filter, cache) {
    cache = cache || {};
    filter = [].concat(filter).filter(Boolean);
    var moduleDir = file.split('/node_modules/')[1];
    moduleDir = moduleDir && moduleDir.split('/')[0];
    if (!moduleDir) {
        return file;
    }
    if (!filter.length || filter.indexOf(moduleDir) > -1) {
        try {
            var rfile = fs.realpathSync(file, cache);
            return rfile;
        } catch (e) {
        }
    }
    return file;
}
