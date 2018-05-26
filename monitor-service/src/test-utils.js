'use strict';

const sinon = require('sinon');

exports.stubConsoleError = function() {
  sinon.stub(console, 'error').callsFake(() => {});
};

exports.unstubConsoleError = function() {
  console.error.restore();
};
