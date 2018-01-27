'use strict';

const sinon = require('sinon');
const request = require('request-promise-lite');
const strategyFactory = require('../lib/venue-processing/venue-strategy-factory');
const strategyRunner = require('../lib/venue-processing/venue-strategy-runner');

describe('venue event monitor integration tests', () => {
  afterEach(() => {
    request.get.restore && request.get.restore();
  });

  const venueIds = [
    // '5th-base',
    // '71a-gallery',
    // 'a-side-b-side-gallery',
    // 'above-the-stag-theatre',
    // 'aktis-gallery',
    // 'alan-cristea-gallery',
    // 'albemarle-gallery',
    // 'alison-jacques-gallery',
    // 'almeida-theatre',
    // 'ambassadors-theatre',
    // 'ambika-p3',
    // 'andor-gallery',
    // 'annely-juda-fine-art',
    // 'anthony-reynolds-gallery',
    // 'aram-gallery',
    // 'arcade',
    // 'arebyte',
    // 'artsdepot',
    // 'architectural-association',
    // 'arcola-theatre',
    // 'art-first',
    // 'arts-theatre',
    // 'asc-gallery',
    // // atg start
    // 'apollo-victoria-theatre',
    // 'duke-of-yorks-theatre',
    // 'fortune-theatre',
    // 'harold-pinter-theatre',
    // 'lyceum-theatre',
    // 'phoenix-theatre',
    // 'piccadilly-theatre',
    // 'playhouse-theatre',
    // 'savoy-theatre',
    // 'trafalgar-studios',
    // // atg end
    // 'atlas-gallery',
    // 'autographabp-rivington-place',
    // 'barbican-centre',
    // 'barons-court-theatre',
    // 'bartha-contemporary',
    // 'battersea-arts-centre',
    // 'beaconsfield-gallery-vauxhall',
    // 'bearspace',
    // 'beers-london',
    // 'ben-brown-fine-arts',
    // 'ben-uri-gallery',
    // 'bernard-jacobson-gallery',
    // 'bethlem-gallery',
    // 'blainorsouthern',
    // 'block-336',
    // 'bloomberg-space',
    // 'bloomsbury-theatre',
    // 'breese-little',
    // 'bridewell-theatre',
    // 'british-library',
    // 'british-museum',
    // 'brocket-gallery',
    // 'brookside-theatre',
    // 'brunei-gallery',
    // 'bush-theatre',
    // 'cadogan-contemporary',
    // Site is running very slowly:
    // // 'calvert-22',
    // 'canal',
    // 'chelsea-space',
    // 'cnb-gallery',
    // 'adelphi-theatre',
    // 'cambridge-theatre',
    // 'her-majestys-theatre',
    // 'london-palladium',
    // 'new-london-theatre',
    // 'theatre-royal-drury-lane',
    // 'aldwych-theatre',
    // 'dominion-theatre',
    // 'apollo-theatre',
    // 'duchess-theatre',
    // 'garrick-theatre',
    // 'lyric-theatre',
    // 'palace-theatre',
    // 'vaudeville-theatre',
    // 'dilston-grove',
    // 'the-gallery-by-the-pool',
    // 'camden-arts-centre',
    // 'camden-peoples-theatre',
    // 'carroll-fletcher',
    // 'catto-gallery',
    // 'cell-project-space',
    // 'centre-for-recent-drawing-c4rd',
    // 'chelsea-theatre',
    // 'chewdays',
    // 'chickenshed-theatre',
    // 'chisenhale-gallery',
    // 'crane-kalman-gallery',
    // 'criterion-theatre',
    // 'cubitt-gallery',
    // 'curious-duke-gallery',
    // 'd-contemporary',
    // 'danielle-arnaud',
    // 'david-gill-gallery',
    // 'david-zwirner',
    // 'design-museum',
    // 'donmar-warehouse',
    // 'drawing-room',
    // 'drayton-arms-theatre',
    // 'dreamspace-gallery',
    // 'dulwich-picture-gallery',
    // 'eagle-gallery',
    // 'edel-assanti',
    // 'erarta-galleries-london',
    // 'erskine-hall-and-coe',
    // 'espacio-gallery',
    // 'estorick-collection-of-modern-italian-art',
    // 'exhibit-gallery',
    // 'fold-gallery',
    // 'fashion-space-gallery',
    // 'fashion-and-textile-museum',
    // 'finborough-theatre',
    // 'flowers-gallery-cork-street',
    // 'flowers-gallery-kingsland-road',
    // 'formans-smokehouse-gallery',
    // 'four-corners',
    // 'french-riviera',
    // 'frith-street-gallery-golden-square',
    // 'frith-street-gallery-soho-square',
    // 'furtherfield-gallery',
    // 'grad2674',
    // 'gagosian-gallery-brittania-street',
    // 'gagosian-gallery-davies-street',
    // 'gagosian-gallery-grosvenor-hill',
    // 'gallery-elena-shchukina',
    // 'gallery-fumi',
    // 'gallery-s-o',
    // 'gasworks-gallery',
    // 'gate-theatre',
    // 'gazelli-art-house',
    // 'geffrye-museum',
    // 'getty-images-gallery',
    // 'gielgud-theatre',
    // 'noel-coward-theatre',
    // 'novello-theatre',
    // 'prince-edward-theatre',
    // 'prince-of-wales-theatre',
    // 'queens-theatre',
    // 'victoria-palace-theatre',
    // 'wyndhams-theatre',
    // 'gimpel-fils',
    // 'graffik-gallery',
    // 'greengrassi',
    // 'greenwood-theatre',
    // 'hackney-empire',
    // 'halcyon-gallery-144-146-new-bond-street',
    // 'halcyon-gallery-29-new-bond-street',
    // 'hales-gallery',
    // 'hamiltons-gallery',
    // 'hampstead-theatre',
    // 'hanmi-gallery',
    // 'hannah-barry-gallery',
    // 'hauser-and-wirth',
    // 'hen-and-chickens-theatre',
    // 'howard-griffin-gallery',
    // 'hoxton-hall-theatre',
    // 'platform-theatre',
    'imt-gallery',
    // 'imperial-war-museum-london',
    // 'institute-of-contemporary-arts',
    // 'islington-arts-factory',
    // 'jack-studio-theatre',
    // 'jacksons-lane',
    // 'james-freeman-gallery',
    // 'jermyn-street-theatre',
    // 'jerwood-space-gallery',
    // 'jewish-museum-london',
    // 'john-martin-gallery',
    // 'jonathan-cooper',
    // 'josh-lilley-gallery',
    // 'kings-head-theatre',
    // 'kings-place',
    // 'kristin-hjellegjerde-gallery',
    // 'lawrence-alkin-gallery',
    // 'lazarides-rathbone',
    // 'leyden-gallery',
    // 'letrangere',
    // 'lion-and-unicorn-theatre',
    // 'lisson-gallery-27-bell-street',
    // 'lisson-gallery-52-bell-street',
    // 'lisson-gallery-67-lisson-street',
    // 'london-arts-board',
    // 'london-coliseum',
    // 'london-transport-museum',
    // 'lychee-one',
    // 'lyric-hammersmith',
    // 'matts-gallery',
    // 'maureen-paley-gallery',
    // 'menier-chocolate-factory',
    // 'menier-gallery',
    // 'mercer-chance',
    // 'michael-hoppen-gallery',
    // 'michael-werner-gallery',
    // 'morley-gallery',
    // 'narrative-projects',
    // 'national-gallery',
    // 'national-portrait-gallery',
    // 'national-theatre',
    // 'natural-history-museum',
    // 'new-diorama-theatre',
    // 'newport-street-gallery',
    // 'nunnery-gallery',
    // 'october-gallery',
    // 'old-red-lion-theatre',
    // 'olivier-malingue',
    // 'orange-tree-theatre',
    // 'ovalhouse',
    // 'peer1482',
    // 'pmam8768',
    // 'pace5406',
    // 'pangolin-london',
    // 'parasol-unit',
    // 'park-theatre',
    // 'peacock-theatre',
    // 'phillips',
    // 'pi-artworks',
    // 'piano-nobile',
    // 'piano-nobile-kings-cross',
    // 'pilar-corrias-gallery',
    // 'pippy-houldsworth-gallery',
    // 'platform-theatre',
    // 'pleasance-theatre',
    // 'plus-one-gallery',
    // 'polka-theatre',
    // 'pump-house-gallery',
    // 'purdy-hicks-gallery',
    // 'putney-arts-theatre',
    // 'riba-headquarters',
    // 'raven-row',
    // 'rebecca-hossack-charlotte-street',
    // 'rebecca-hossack-conway-street',
    // 'rebecca-louise-law-gallery',
    // 'regents-park-open-air-theatre',
    // 'rich-mix',
    // 'richard-saltoun',
    // 'richard-young-gallery',
    // 'ronchini-gallery',
    // 'rosemary-branch-theatre',
    // 'rosenfeld-porcini',
    // 'roundhouse',
    // 'rowing',
    // 'royal-academy-of-arts',
    // 'royal-court-theatre',
    // 'royal-opera-house',
    // 'saatchi-gallery',
    // 'sadie-coles-davies-street',
    // 'sadie-coles-kingly-street',
    // 'sadlers-wells',
    // 'serpentine-gallery',
    // 'serpentine-sackler-gallery',
    // 'shaftesbury-theatre',
    // 'shakespeares-globe',
    // 'shaw-theatre',
    // 'shoreditch-town-hall',
    // 'skarstedt',
    // 'soho-theatre',
    // 'somerset-house',
    // 'sophia-contemporary-gallery',
    // 'south-london-gallery',
    // 'southard-reid',
    // 'southbank-centre',
    // 'southwark-playhouse',
    // 'sprovieri-gallery',
    // 'st-martins-theatre',
    // 'stolenspace-gallery',
    // 'store-street-gallery',
    // 'studio-11',
    // 'studio-voltaire',
    // 't-j-boulting',
    // 'tabard-theatre',
    // 'tate-britain',
    // 'tate-modern',
    // 'the-albany',
    // 'the-building-centre',
    // 'the-bunker',
    // 'the-clf-theatre',
    // 'the-cob-gallery',
    // 'the-cockpit',
    // 'the-coningsby-gallery',
    // 'the-courtauld-gallery',
    // 'the-courtyard-theatre',
    // 'the-dot-project',
    // 'the-fitzrovia-gallery',
    // 'the-foundry-gallery',
    // 'the-hope-theatre',
    // 'the-london-theatre-new-cross',
    // 'the-mosaic-rooms',
    // 'the-old-vic',
    // 'the-other-palace',
    // 'the-photographers-gallery',
    // 'the-questors-theatre',
    // 'the-ryder-projects',
    // 'the-residence-gallery',
    // 'the-rose-playhouse',
    // 'the-space',
    // 'the-vaults',
    // 'the-wallace-collection',
    // 'the-yard',
    // 'theatre-n16',
    // 'theatre-royal-haymarket',
    // 'theatre-royal-stratford-east',
    // 'theatre503',
    // 'theatro-technis',
    // 'timothy-taylor',
    // 'tiwani-contemporary',
    // 'transition-gallery',
    // 'tricycle-theatre',
    // 'tristan-bates-theatre',
    // 'tristan-hoare',
    // 'two-temple-place',
    // 'ual-showroom',
    // 'unicorn-theatre',
    // 'union-gallery',
    // 'union-theatre',
    // 'unit-g-gallery',
    // 'unit-london',
    // 'upstairs-at-the-gatehouse',
    // 'vanda-museum-of-childhood',
    // 'victoria-and-albert-museum',
    // 'vitrine',
    // 'victoria-miro-wharf-road',
    // 'victoria-miro-mayfair',
    // 'waddington-custot',
    // 'waterloo-east-theatre',
    // 'well-hung',
    // 'wellcome-collection',
    // 'white-bear-theatre',
    // 'white-cube-bermondsey',
    // 'white-cube-masons-yard',
    // 'white-rainbow',
    // 'whitechapel-gallery',
    // 'wilkinson-gallery',
    // 'william-benington-gallery',
    // 'william-morris-gallery',
    // 'wiltons-music-hall',
    // 'wimbledon-space',
    // 'woolff-gallery',
    // 'ye-olde-rose-and-crown-theatre',
    // 'young-vic',
  ];

  venueIds.forEach(venueId => {
    it('should process venue ' + venueId, done => {
      sinon.stub(request, 'get').callsFake(() => {
        return Promise.resolve({ items: [] });
      });

      const venueStrategy = strategyFactory.create(venueId);
      if (!venueStrategy) {
        done();
        return;
      }

      Promise.all([
        strategyRunner.discoverEvents(venueId, venueStrategy),
        strategyRunner.getVenueData(venueStrategy),
      ])
        .then(result => {
          const discoveredEvents = result[0];
          const venueData = result[1];

          console.log(discoveredEvents);
          console.log(venueData);

          done();
        })
        .catch(done);
    }).timeout(300000);
  });
});