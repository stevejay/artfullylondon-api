'use strict';

const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-string'));
const diff = require('../../lib/venue-processing/diff');

describe('diff', () => {
  describe('getDiff', () => {
    it('should create a diff', done => {
      diff
        .getDiff('Foobar', 'Fowba')
        .then(result => {
          expect(result).toEqual(
            '<p>Fo<del>o</del><ins>w</ins>ba<del>r</del></p>'
          );
          done();
        })
        .catch(done);
    });

    it('should replace newlines with break elements', done => {
      diff
        .getDiff(' ', ' a\nb\nc')
        .then(result => {
          expect(result).toEqual('<p> <ins>a<br/>b<br/>c</ins></p>');
          done();
        })
        .catch(done);
    });

    it('should create a large diff', done => {
      diff
        .getDiff(
          ' ',
          '27 Apr 2017 - 3 Jun 2017\n\nInfinite Loop is an exhibition of new work by British artist duo Langlands &\nBell, depicting the futuristic architecture of 21st century global internet\ngiants.\n\nSince the 1980s Ben Langlands and Nikki Bell, through film and video, digital\nmedia projects, sculpture, installation, prints, and architecture, have decoded\nthe structures of different types of buildings, from the past as well as the\npresent, from our own society and from other cultures, including, The House of\nOsama Bin Laden (2003), their Turner Prize nomination work made while they were\nofficial war artists investigating The Aftermath of 9/11 and the War in\nAfghanistan.\n\nInfinite Loop, Langlands & Bell’s largest UK exhibition for several years,\nfocuses on a new generation of architecture, including the new headquarters of\nApple, The Gates Foundation and Facebook, and investigates how these structures\nconvey notions of power and human interaction in the 21st century.\n\nInfinite Loop, which takes its name from the address of the new Apple HQ at\nCupertino in California, sees Langlands & Bell turn their attention to the\nbiggest and most successful companies in the world. Over the past five years,\nusing the internet, Langlands & Bell have researched and made models of\nbuildings as they were being built; The Gates Foundation, Seattle; IBM, Beijing;\nand Nvidia, Apple and Facebook, all situated in California.\n\nThe exhibition includes twenty four editioned prints, presented in different\ncolour variations, which illustrate futuristic models of the buildings as if\nthey are floating in space. Infinite Loop (2016), which is also the title of\nfour new prints, depicts the Apple headquarters isolated from its surroundings\nand turned on its side, shown at various points in rotation. Nicknamed ‘the\nspace ship’ by Apple employees, the building has been designed by Foster and\nPartners. The architecture portrayed in Gates Foundation (Seattle), (2016), was\ndesigned by architects NBBJ, who were inspired by a map of the globe\nillustrating the pathways of world commerce and migration. Facebook, Menlo Park \n(2017), a wall sculpture which depicts the company’s interior, explores\nFacebook’s new ‘campus’ headquarters. Designed by Frank Gehry, it is the single\nlargest room in the world with a half-mile walking loop, enabling free movement\nof 2,800 employees.\n\nThis new body of prints and wall sculptures reflects the power and influence of\n21st century global internet giants through the very design of their headquarter\nbuildings, and the coded systems of mass-communication they use to negotiate a\nfast changing technological world.'
        )
        .then(result => {
          expect(result).to.startWith('<p><ins>27');
          expect(result).to.endWith('world.</ins></p>');
          done();
        })
        .catch(done);
    });

    it('should handle null inputs', done => {
      diff
        .getDiff(null, null)
        .then(result => {
          expect(result).toEqual('<p></p>');
          done();
        })
        .catch(done);
    });
  });
});
