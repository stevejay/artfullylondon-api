'use strict';

const expect = require('chai').expect;
const pageLoader = require('../lib/venue-processing/page-loader');

describe('page-loader', () => {
  describe('staticLoader', () => {
    it('should load a valid url', done => {
      pageLoader
        .staticLoader('https://www.google.co.uk/')
        .then($ => {
          expect($('title').text()).to.eql('Google');
          done();
        })
        .catch(done);
    }).timeout(10000);
  });

  describe('spaLoader', () => {
    it('should load a valid url', done => {
      pageLoader
        .spaLoader('https://www.google.co.uk/')
        .then($ => {
          expect($('title').text()).to.eql('Google');
          done();
        })
        .catch(done);
    }).timeout(20000);
  });
});
