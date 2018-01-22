'use strict';

const sinon = require('sinon');

module.exports.stubConsoleError = function() {
  sinon.stub(console, 'error').callsFake(() => {});
};

module.exports.unstubConsoleError = function() {
  console.error.restore();
};
