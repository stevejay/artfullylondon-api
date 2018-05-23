'use strict';

exports.createMediumWithStyleTag = (mediumTag, styleTag) => {
  const styleId = styleTag.id.slice(5); // remove initial 'style' text
  const newId = mediumTag.id + styleId;
  const newLabel = styleTag.label + ' ' + mediumTag.label;
  return { id: newId, label: newLabel };
};
