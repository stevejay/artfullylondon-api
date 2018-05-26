'use strict';

const htmlToText = require('html-to-text');
const sanitizeHtml = require('sanitize-html');

function toText(html) {
  return htmlToText.fromString(sanitizeHtml(html), {
    ignoreHref: true,
    ignoreImage: true,
  });
}

module.exports = exports = function(html) {
  const result = Array.isArray(html)
    ? html.filter(x => !!x).map(toText).map(x => x.trim()).join('\n\n')
    : toText(html).trim();

  return result.replace(/\n\s+\n/g, '\n\n');
};
