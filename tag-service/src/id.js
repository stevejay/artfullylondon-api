'use strict';

const slug = require('limax');

exports.createTagIdFromLabel = function(prefix, label) {
  return prefix + '/' + slug(label, { maintainCase: false });
};

exports.createTagId = function(/* arguments */) {
  return Array.from(arguments).join('/');
};
