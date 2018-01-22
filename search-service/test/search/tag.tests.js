'use strict';

const expect = require('chai').expect;
const tag = require('../../lib/search/tag');

describe('tag', function() {
  describe('createTagIdForMediumWithStyleTag', function() {
    it('should create the tag id', function() {
      const actual = tag.createTagIdForMediumWithStyleTag(
        'medium/painting',
        'style/contemporary'
      );

      expect(actual).to.eql('medium/painting/contemporary');
    });
  });
});
