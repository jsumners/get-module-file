'use strict';

const path = require('path');
const expect = require('chai').expect;
const gmf = require(path.join(__dirname, '..', 'gmf'));

test('find file asynchronously', function(done) {
  gmf.async(__dirname, 'mocha', './mocha.js', function(err, filePath) {
    if (!err) {
      expect(filePath).to.contain('/node_modules/mocha/mocha.js');
      done();
    }
  });
});

test('find file synchronously', function(done) {
  const fp = gmf.sync(__dirname, 'mocha', './mocha.js');
  expect(fp).to.be.a.string;
  expect(fp).to.contain('/node_modules/mocha/mocha.js');
  done();
});

test('returns error on async failure', function(done) {
  gmf.async(__dirname, 'foo', '/bar/file.css', function(err) {
    expect(err).to.not.be.null;
    expect(err).to.be.an.instanceof(Error);
    expect(err.code).to.equal('ENOENT');
    done();
  });
});

test('returns false for missing synchronous file', function(done) {
  const result = gmf.sync(__dirname, 'foo', '/bar/file.css');
  expect(result).to.be.a.boolean;
  expect(result).to.equal(false);
  done();
});

test('future resolves for present file', function(done) {
  gmf.future(__dirname, 'mocha', '/mocha.js')
    .then(function(fp) {
      expect(fp).to.be.a.string;
      expect(fp).to.contain('/node_modules/mocha/mocha.js');
      done();
    });
});

test('future rejects for missing file', function(done) {
  gmf.future(__dirname, 'foo', '/bar/file.css')
    .then(function(){})
    .catch(function(err) {
      expect(err).to.not.be.null;
      expect(err).to.be.an.instanceof(Error);
      expect(err.code).to.equal('ENOENT');
      done();
    });
});
