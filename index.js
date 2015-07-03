var fs = require('fs');

module.exports = function (b, opts) {
    opts = opts || {};
    var filter = [].concat(opts.filter).filter(Boolean);
    var bresolve = b._bresolve;
    b._bresolve = realpathResolve(bresolve, filter);
};

module.exports.realpathResolve = realpathResolve;

function realpathResolve(resolve, filter) {
    var cache = {};
    return function (id, parent, cb) {
        resolve(id, parent, function (err, file, pkg) {
            if (err) {
                return cb(err, file, pkg);
            }
            var moduleDir = file.split('/node_modules/')[1];
            moduleDir = moduleDir && moduleDir.split('/')[0];
            if (!moduleDir) {
                return cb(err, file, pkg);
            }
            if (!filter.length || filter.indexOf(moduleDir) > -1) {
                var rfile = fs.realpathSync(file, cache);
                cache[file] = rfile;
                return cb(err, rfile, pkg);
            }
            return cb(err, file, pkg);
        });
    };
}
