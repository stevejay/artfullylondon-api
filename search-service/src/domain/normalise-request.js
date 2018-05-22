'use strict';

const normaliseRequest = require('normalise-request');
const simplify = require('es-simplify');

function simplifyNormaliser(param) {
  if (typeof param !== 'string') {
    return param;
  }

  return simplify(param);
}

normaliseRequest.normalisers.simplify = simplifyNormaliser;
module.exports = normaliseRequest;
