'use strict';

const fs = require('fs');
const path = require('canonical-path');
const debug = require('debug')('get-module-file');

function findModuleDir(start, cb) {
  const fp = path.resolve(path.join(start, 'node_modules'));
  fs.stat(fp, function(err, stats) {
    if (err) {
      const newStart = path.resolve(path.join(start, '..'));
      return findModuleDir(newStart, cb);
    }

    if (stats.isDirectory()) {
      cb(fp);
    }
  });
}

function findModuleDirSync(start) {
  let fp = path.resolve(path.join(start, 'node_modules'));
  let result;

  while (!result) {
    try {
      fs.statSync(fp);
      result = fp;
    } catch (e) {
      fp = path.resolve(path.join(fp, '..', '..', 'node_modules'));
    }
  }

  return result;
}

function async(startdir, moduleName, filePath, cb) {
  function foundMDir(mdir) {
    debug('module directory = %s', mdir);
    const fp = path.resolve(path.join(mdir, moduleName, filePath));
    fs.stat(fp, function(err) {
      if (err) {
        debug('could not find %s/%s', moduleName, filePath);
        debug(err.message);
        return cb(err);
      }

      debug('file path = %s', fp);
      cb(null, fp);
    });
  }

  findModuleDir(startdir, foundMDir);
}

function sync(startdir, moduleName, filePath) {
  const mdir = findModuleDirSync(startdir);
  debug('module directory = %s', mdir);
  let result;
  try {
    const fp = path.resolve(path.join(mdir, moduleName, filePath));
    fs.statSync(fp);
    result = fp;
  } catch (e) {
    result = false;
    debug('could not find %s/%s', moduleName, filePath);
    debug(e.message);
  }

  debug('result = %s', result);
  return result;
}

function future(startdir, moduleName, filePath) {
  function promise(resolve, reject) {
    async(startdir, moduleName, filePath, function(err, fp) {
      return (err) ? reject(err) : resolve(fp);
    });
  }

  return new Promise(promise);
}

module.exports.async = async;
module.exports.sync = sync;
module.exports.future = future;
