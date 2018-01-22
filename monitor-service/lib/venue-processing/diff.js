'use strict';

const diff = require('fast-diff');

module.exports.getDiff = function(oldText, newText) {
  let result = null;

  if (!oldText) {
    result = newText || '';
  } else {
    const changes = diff(oldText || '', newText || '');

    result = changes
      .map(function(edit) {
        const action = edit[0];
        const text = edit[1];

        if (action > 0) {
          return '<ins>' + text + '</ins>';
        } else if (action < 0) {
          return '<del>' + text + '</del>';
        } else {
          return text;
        }
      })
      .join('')
      .replace(/\n/g, '<br/>');
  }

  return Promise.resolve('<p>' + result + '</p>');
};
