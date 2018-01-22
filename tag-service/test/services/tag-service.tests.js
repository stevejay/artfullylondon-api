'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const tagRepository = require('../../lib/persistence/tag-repository');
const tagService = require('../../lib/services/tag-service');

describe('tag-service', () => {
  describe('getTagsByType', () => {
    afterEach(() => {
      tagRepository.getAllByTagType.restore &&
        tagRepository.getAllByTagType.restore();
    });

    it('should get all tags by type for a valid request', done => {
      sinon.stub(tagRepository, 'getAllByTagType').callsFake(param => {
        expect(param).to.eql('geo');
        return Promise.resolve([{ id: 'geo/usa', label: 'usa' }]);
      });

      tagService
        .getTagsByType({ tagType: 'geo' })
        .then(response => {
          expect(response).to.eql({
            tags: {
              geo: [{ id: 'geo/usa', label: 'usa' }],
            },
          });

          done();
        })
        .catch(done);
    });

    it('should throw an exception for an invalid request', done => {
      tagService
        .getTagsByType({ tagType: 'unknown' })
        .then(() => done(new Error('should have thrown an exception')))
        .catch(() => done());
    });
  });

  describe('getAllTags', () => {
    afterEach(() => {
      tagRepository.getAll.restore && tagRepository.getAll.restore();
    });

    it('should get all tags for a valid request', done => {
      sinon.stub(tagRepository, 'getAll').callsFake(() => {
        return Promise.resolve([
          { id: 'geo/usa', label: 'usa' },
          { id: 'audience/families', label: 'families' },
        ]);
      });

      tagService
        .getAllTags()
        .then(response => {
          expect(response).to.eql({
            tags: {
              geo: [{ id: 'geo/usa', label: 'usa' }],
              audience: [{ id: 'audience/families', label: 'families' }],
            },
          });

          done();
        })
        .catch(done);
    });
  });

  describe('deleteTag', () => {
    afterEach(() => {
      tagRepository.deleteTag.restore && tagRepository.deleteTag.restore();
    });

    it('should delete a tag for a valid request', done => {
      sinon.stub(tagRepository, 'deleteTag').callsFake((type, tagId) => {
        expect(type).to.eql('geo');
        expect(tagId).to.eql('geo/usa');
        return Promise.resolve();
      });

      tagService
        .deleteTag({ type: 'geo', idPart: 'usa' })
        .then(() => done())
        .catch(done);
    });
  });

  describe('createTag', () => {
    afterEach(() => {
      tagRepository.saveTag.restore && tagRepository.saveTag.restore();
    });

    it('should create a tag for a valid request', done => {
      sinon.stub(tagRepository, 'saveTag').callsFake(param => {
        expect(param).to.eql({
          id: 'geo/usa',
          tagType: 'geo',
          label: 'usa',
        });

        return Promise.resolve();
      });

      tagService
        .createTag({ type: 'geo', label: 'USA' })
        .then(response => {
          expect(response).to.eql({ tag: { id: 'geo/usa', label: 'usa' } });
          done();
        })
        .catch(done);
    });

    it('should throw an error for an invalid request', done => {
      tagService
        .createTag({ type: 'unknown', label: 'USA' })
        .then(() => {
          done(new Error('should have thrown an exception'));
        })
        .catch(() => done());
    });
  });
});
