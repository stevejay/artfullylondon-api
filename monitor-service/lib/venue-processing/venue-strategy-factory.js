'use strict';

const aSideBSideGallery = require('../venues/a/a-side-b-side-gallery');
const aboveTheStagTheatre = require('../venues/a/above-the-stag-theatre');
const aktisGallery = require('../venues/a/aktis-gallery');
const alanCristeaGallery = require('../venues/a/alan-cristea-gallery');
const albemarleGallery = require('../venues/a/albemarle-gallery');
const alisonJacquesGallery = require('../venues/a/alison-jacques-gallery');
const almeidaTheatre = require('../venues/a/almeida-theatre');
const ambassadorsTheatre = require('../venues/a/ambassadors-theatre');
const ambikaP3 = require('../venues/a/ambika-p3');
const annelyJudaFineArt = require('../venues/a/annely-juda-fine-art');
const anthonyReynoldsGallery = require('../venues/a/anthony-reynolds-gallery');
const atgVenues = require('../venues/a/atg-venues');
const aramGallery = require('../venues/a/aram-gallery');
const arcade = require('../venues/a/arcade');
const architecturalAssociation = require('../venues/a/architectural-association');
const arcolaTheatre = require('../venues/a/arcola-theatre');
const artFirst = require('../venues/a/art-first');
const artsTheatre = require('../venues/a/arts-theatre');
const autographAbp = require('../venues/a/autographabp-rivington-place');
const andorGallery = require('../venues/a/andor-gallery');
const ascGallery = require('../venues/a/asc-gallery');
const atlasGallery = require('../venues/a/atlas-gallery');
const bearspace = require('../venues/b/bearspace');
const barbicanCentre = require('../venues/b/barbican-centre');
const baronsCourtTheatre = require('../venues/b/barons-court-theatre');
const barthaContemporary = require('../venues/b/bartha-contemporary');
const batterseaArtsCentre = require('../venues/b/battersea-arts-centre');
const beaconsfieldGalleryVauxhall = require('../venues/b/beaconsfield-gallery-vauxhall');
const beersLondon = require('../venues/b/beers-london');
const benBrownFineArts = require('../venues/b/ben-brown-fine-arts');
const benUriGallery = require('../venues/b/ben-uri-gallery');
const bernardJacobsonGallery = require('../venues/b/bernard-jacobson-gallery');
const bethlemGallery = require('../venues/b/bethlem-gallery');
const blainSouthern = require('../venues/b/blainorsouthern');
const block336 = require('../venues/b/block-336');
const bloombergSpace = require('../venues/b/bloomberg-space');
const bloomsburyTheatre = require('../venues/b/bloomsbury-theatre');
const breeseLittle = require('../venues/b/breese-little');
const bridewellTheatre = require('../venues/b/bridewell-theatre');
const britishLibrary = require('../venues/b/british-library');
const britishMuseum = require('../venues/b/british-museum');
const brocketGallery = require('../venues/b/brocket-gallery');
const brooksideTheatre = require('../venues/b/brookside-theatre');
const bruneiGallery = require('../venues/b/brunei-gallery');
const bushTheatre = require('../venues/b/bush-theatre');
const fifthBase = require('../venues/0-9/5th-base');
const seventyOneAGallery = require('../venues/0-9/71a-gallery');
const canal = require('../venues/c/canal');
const cgpVenues = require('../venues/c/cgp-venues');
const chelseaSpace = require('../venues/c/chelsea-space');
const cnbGallery = require('../venues/c/cnb-gallery');
const cadoganContemporary = require('../venues/c/cadogan-contemporary');
const calvert22 = require('../venues/c/calvert-22');
const reallyUsefulTheatres = require('../venues/r/really-useful-theatres');
const theOtherPalace = require('../venues/t/the-other-palace');
const nimaxTheatres = require('../venues/n/nimax-theatres');
const nederlanderTheatres = require('../venues/n/nederlander-theatres');
const royalAcademyOfArts = require('../venues/r/royal-academy-of-arts');
const camdenArtsCentre = require('../venues/c/camden-arts-centre');
const camdenPeoplesTheatre = require('../venues/c/camden-peoples-theatre');
const carrollFletcher = require('../venues/c/carroll-fletcher');
const cattoGallery = require('../venues/c/catto-gallery');
const cellProjectSpace = require('../venues/c/cell-project-space');
const centreForRecentDrawing = require('../venues/c/centre-for-recent-drawing-c4rd');
const chelseaTheatre = require('../venues/c/chelsea-theatre');
const chewdays = require('../venues/c/chewdays');
const chickenshedTheatre = require('../venues/c/chickenshed-theatre');
const chisenhaleGallery = require('../venues/c/chisenhale-gallery');
const craneKalmanGallery = require('../venues/c/crane-kalman-gallery');
const criterionTheatre = require('../venues/c/criterion-theatre');
const cubittGallery = require('../venues/c/cubitt-gallery');
const curiousDukeGallery = require('../venues/c/curious-duke-gallery');
const dContemporary = require('../venues/d/d-contemporary');
const danielleArnaud = require('../venues/d/danielle-arnaud');
const davidGillGallery = require('../venues/d/david-gill-gallery');
const davidZwirner = require('../venues/d/david-zwirner');
const designMuseum = require('../venues/d/design-museum');
const donmarWarehouse = require('../venues/d/donmar-warehouse');
const drawingRoom = require('../venues/d/drawing-room');
const draytonArmsTheatre = require('../venues/d/drayton-arms-theatre');
const dreamspaceGallery = require('../venues/d/dreamspace-gallery');
const dulwichPictureGallery = require('../venues/d/dulwich-picture-gallery');
const exhibitGallery = require('../venues/e/exhibit-gallery');
const eagleGallery = require('../venues/e/eagle-gallery');
const edelAssanti = require('../venues/e/edel-assanti');
const erartaGalleriesLondon = require('../venues/e/erarta-galleries-london');
const erskineHallAndCoe = require('../venues/e/erskine-hall-and-coe');
const espacioGallery = require('../venues/e/espacio-gallery');
const estorick = require('../venues/e/estorick-collection-of-modern-italian-art');
const foldGallery = require('../venues/f/fold-gallery');
// const fashionSpaceGallery = require('../venues/f/fashion-space-gallery');
const fashionAndTextileMuseum = require('../venues/f/fashion-and-textile-museum');
const finboroughTheatre = require('../venues/f/finborough-theatre');
const flowersGalleries = require('../venues/f/flowers-galleries');
const formansSmokehouseGallery = require('../venues/f/formans-smokehouse-gallery');
const fourCorners = require('../venues/f/four-corners');
const frenchRiviera = require('../venues/f/french-riviera');
const frithStreetGalleries = require('../venues/f/frith-street-galleries');
const furtherfieldGallery = require('../venues/f/furtherfield-gallery');
const grad = require('../venues/g/grad2674');
const gagosianGalleries = require('../venues/g/gagosian-galleries');
const galleryElenaShchukina = require('../venues/g/gallery-elena-shchukina');
// const galleryFumi = require('../venues/g/gallery-fumi');
const gallerySO = require('../venues/g/gallery-s-o');
const gasworksGallery = require('../venues/g/gasworks-gallery');
const gateTheatre = require('../venues/g/gate-theatre');
const gazelliArtHouse = require('../venues/g/gazelli-art-house');
const geffryeMuseum = require('../venues/g/geffrye-museum');
const gettyImagesGallery = require('../venues/g/getty-images-gallery');
const delfontMackintoshTheatres = require('../venues/d/delfont-mackintosh-theatres');
const gimpelFils = require('../venues/g/gimpel-fils');
const graffikGallery = require('../venues/g/graffik-gallery');
const greengrassi = require('../venues/g/greengrassi');
const greenwoodTheatre = require('../venues/g/greenwood-theatre');
const hackneyEmpire = require('../venues/h/hackney-empire');
const halcyonGalleries = require('../venues/h/halcyon-galleries');
const halesGallery = require('../venues/h/hales-gallery');
const hamiltonsGallery = require('../venues/h/hamiltons-gallery');
const hampsteadTheatre = require('../venues/h/hampstead-theatre');
const hanmiGallery = require('../venues/h/hanmi-gallery');
const hannahBarryGallery = require('../venues/h/hannah-barry-gallery');
const hauserAndWirth = require('../venues/h/hauser-and-wirth');
const henAndChickensTheatre = require('../venues/h/hen-and-chickens-theatre');
const howardGriffinGallery = require('../venues/h/howard-griffin-gallery');
const hoxtonHallTheatre = require('../venues/h/hoxton-hall-theatre');
const imtGallery = require('../venues/i/imt-gallery');
const imperialWarMuseumLondon = require('../venues/i/imperial-war-museum-london');
const instituteOfContemporaryArts = require('../venues/i/institute-of-contemporary-arts');
// const platformTheatre = require('../venues/p/platform-theatre');
const islingtonArtsFactory = require('../venues/i/islington-arts-factory');
const jackStudioTheatre = require('../venues/j/jack-studio-theatre');
const jacksonsLane = require('../venues/j/jacksons-lane');
const jamesFreemanGallery = require('../venues/j/james-freeman-gallery');
const jermynStreetTheatre = require('../venues/j/jermyn-street-theatre');
const jerwoodSpaceGallery = require('../venues/j/jerwood-space-gallery');
const jewishMuseumLondon = require('../venues/j/jewish-museum-london');
const johnMartinGallery = require('../venues/j/john-martin-gallery');
const jonathanCooper = require('../venues/j/jonathan-cooper');
const joshLilleyGallery = require('../venues/j/josh-lilley-gallery');
const kingsHeadTheatre = require('../venues/k/kings-head-theatre');
const kingsPlace = require('../venues/k/kings-place');
const kristinHjellegjerdeGallery = require('../venues/k/kristin-hjellegjerde-gallery');
const lawrenceAlkinGallery = require('../venues/l/lawrence-alkin-gallery');
const lazaridesRathbone = require('../venues/l/lazarides-rathbone');
const leydenGallery = require('../venues/l/leyden-gallery');
const lionAndUnicornTheatre = require('../venues/l/lion-and-unicorn-theatre');
const lissonGalleries = require('../venues/l/lisson-galleries');
const londonArtsBoard = require('../venues/l/london-arts-board');
const londonColiseum = require('../venues/l/london-coliseum');
const londonTransportMuseum = require('../venues/l/london-transport-museum');
const lycheeOne = require('../venues/l/lychee-one');
const lyricHammersmith = require('../venues/l/lyric-hammersmith');
const mattsGallery = require('../venues/m/matts-gallery');
const maureenPaleyGallery = require('../venues/m/maureen-paley-gallery');
const menierChocolateFactory = require('../venues/m/menier-chocolate-factory');
const menierGallery = require('../venues/m/menier-gallery');
const mercerChance = require('../venues/m/mercer-chance');
const michaelHoppenGallery = require('../venues/m/michael-hoppen-gallery');
const michaelWernerGallery = require('../venues/m/michael-werner-gallery');
const morleyGallery = require('../venues/m/morley-gallery');
const narrativeProjects = require('../venues/n/narrative-projects');
const nationalGallery = require('../venues/n/national-gallery');
const nationalPortraitGallery = require('../venues/n/national-portrait-gallery');
const nationalTheatre = require('../venues/n/national-theatre');
const naturalHistoryMuseum = require('../venues/n/natural-history-museum');
const newDioramaTheatre = require('../venues/n/new-diorama-theatre');
const newportStreetGallery = require('../venues/n/newport-street-gallery');
const nunneryGallery = require('../venues/n/nunnery-gallery');
const octoberGallery = require('../venues/o/october-gallery');
const oldRedLionTheatre = require('../venues/o/old-red-lion-theatre');
const olivierMalingue = require('../venues/o/olivier-malingue');
const orangeTreeTheatre = require('../venues/o/orange-tree-theatre');
const ovalhouse = require('../venues/o/ovalhouse');
const peer1482 = require('../venues/p/peer1482');
const pmam8768 = require('../venues/p/pmam8768');
const pace5406 = require('../venues/p/pace5406');
const pangolinLondon = require('../venues/p/pangolin-london');
const parasolUnit = require('../venues/p/parasol-unit');
const parkTheatre = require('../venues/p/park-theatre');
const peacockTheatre = require('../venues/p/peacock-theatre');
const phillips = require('../venues/p/phillips');
const piArtworks = require('../venues/p/pi-artworks');
const pianoNobile = require('../venues/p/piano-nobile');
const pilarCorriasGallery = require('../venues/p/pilar-corrias-gallery');
const pippyHouldsworthGallery = require('../venues/p/pippy-houldsworth-gallery');
const pleasanceTheatre = require('../venues/p/pleasance-theatre');
const plusOneGallery = require('../venues/p/plus-one-gallery');
const polkaTheatre = require('../venues/p/polka-theatre');
const pumpHouseGallery = require('../venues/p/pump-house-gallery');
const purdyHicksGallery = require('../venues/p/purdy-hicks-gallery');
const putneyArtsTheatre = require('../venues/p/putney-arts-theatre');
const ribaHeadquarters = require('../venues/r/riba-headquarters');
const ravenRow = require('../venues/r/raven-row');
const rebeccaHossackGalleries = require('../venues/r/rebecca-hossack-galleries');
const rebeccaLouiseLawGallery = require('../venues/r/rebecca-louise-law-gallery');
const regentsParkOpenAirTheatre = require('../venues/r/regents-park-open-air-theatre');
const richMix = require('../venues/r/rich-mix');
const richardSaltoun = require('../venues/r/richard-saltoun');
const richardYoungGallery = require('../venues/r/richard-young-gallery');
const ronchiniGallery = require('../venues/r/ronchini-gallery');
const rosemaryBranchTheatre = require('../venues/r/rosemary-branch-theatre');
const rosenfeldPorcini = require('../venues/r/rosenfeld-porcini');
const roundhouse = require('../venues/r/roundhouse');
const rowing = require('../venues/r/rowing');
const royalCourtTheatre = require('../venues/r/royal-court-theatre');
const royalOperaHouse = require('../venues/r/royal-opera-house');
const saatchiGallery = require('../venues/s/saatchi-gallery');
const sadieColesGalleries = require('../venues/s/sadie-coles-galleries');
const sadlersWells = require('../venues/s/sadlers-wells');
const serpentineGalleries = require('../venues/s/serpentine-galleries');
const shaftesburyTheatre = require('../venues/s/shaftesbury-theatre');
const shakespearesGlobe = require('../venues/s/shakespeares-globe');
const shawTheatre = require('../venues/s/shaw-theatre');
const shoreditchTownHall = require('../venues/s/shoreditch-town-hall');
const skarstedt = require('../venues/s/skarstedt');
const sohoTheatre = require('../venues/s/soho-theatre');
const somersetHouse = require('../venues/s/somerset-house');
const sophiaContemporaryGallery = require('../venues/s/sophia-contemporary-gallery');
const southLondonGallery = require('../venues/s/south-london-gallery');
const southardReid = require('../venues/s/southard-reid');
const southbankCentre = require('../venues/s/southbank-centre');
const southwarkPlayhouse = require('../venues/s/southwark-playhouse');
const sprovieriGallery = require('../venues/s/sprovieri-gallery');
const stMartinsTheatre = require('../venues/s/st-martins-theatre');
const stolenspaceGallery = require('../venues/s/stolenspace-gallery');
const storeStreetGallery = require('../venues/s/store-street-gallery');
const studio11 = require('../venues/s/studio-11');
const studioVoltaire = require('../venues/s/studio-voltaire');
const tJBoulting = require('../venues/t/t-j-boulting');
const tabardTheatre = require('../venues/t/tabard-theatre');
const tateGalleries = require('../venues/t/tate-galleries');
const theAlbany = require('../venues/t/the-albany');
const theBuildingCentre = require('../venues/t/the-building-centre');
const theBunker = require('../venues/t/the-bunker');
const theClfTheatre = require('../venues/t/the-clf-theatre');
const theCobGallery = require('../venues/t/the-cob-gallery');
const theCockpit = require('../venues/t/the-cockpit');
const theConingsbyGallery = require('../venues/t/the-coningsby-gallery');
const theCourtauldGallery = require('../venues/t/the-courtauld-gallery');
const theCourtyardTheatre = require('../venues/t/the-courtyard-theatre');
const theDotProject = require('../venues/t/the-dot-project');
const theFitzroviaGallery = require('../venues/t/the-fitzrovia-gallery');
const theFoundryGallery = require('../venues/t/the-foundry-gallery');
const theHopeTheatre = require('../venues/t/the-hope-theatre');
const theLondonTheatreNewCross = require('../venues/t/the-london-theatre-new-cross');
const theMosaicRooms = require('../venues/t/the-mosaic-rooms');
const theOldVic = require('../venues/t/the-old-vic');
const thePhotographersGallery = require('../venues/t/the-photographers-gallery');
const theQuestorsTheatre = require('../venues/t/the-questors-theatre');
const theRyderProjects = require('../venues/t/the-ryder-projects');
const theResidenceGallery = require('../venues/t/the-residence-gallery');
const theRosePlayhouse = require('../venues/t/the-rose-playhouse');
const theSpace = require('../venues/t/the-space');
const theVaults = require('../venues/t/the-vaults');
const theWallaceCollection = require('../venues/t/the-wallace-collection');
const theYard = require('../venues/t/the-yard');
const theatreN16 = require('../venues/t/theatre-n16');
const theatreRoyalHaymarket = require('../venues/t/theatre-royal-haymarket');
const theatreRoyalStratfordEast = require('../venues/t/theatre-royal-stratford-east');
const theatre503 = require('../venues/t/theatre503');
const theatroTechnis = require('../venues/t/theatro-technis');
const timothyTaylor = require('../venues/t/timothy-taylor');
const tiwaniContemporary = require('../venues/t/tiwani-contemporary');
const transitionGallery = require('../venues/t/transition-gallery');
const tricycleTheatre = require('../venues/t/tricycle-theatre');
const tristanBatesTheatre = require('../venues/t/tristan-bates-theatre');
const tristanHoare = require('../venues/t/tristan-hoare');
const twoTemplePlace = require('../venues/t/two-temple-place');
const ualShowroom = require('../venues/u/ual-showroom');
const unicornTheatre = require('../venues/u/unicorn-theatre');
const unionGallery = require('../venues/u/union-gallery');
const unionTheatre = require('../venues/u/union-theatre');
const unitGGallery = require('../venues/u/unit-g-gallery');
const unitLondon = require('../venues/u/unit-london');
const upstairsAtTheGatehouse = require('../venues/u/upstairs-at-the-gatehouse');
const vAndAMuseumOfChildhood = require('../venues/v/vanda-museum-of-childhood');
const vitrine = require('../venues/v/vitrine');
const victoriaMiroGalleries = require('../venues/v/victoria-miro-galleries');
const victoriaAndAlbertMuseum = require('../venues/v/victoria-and-albert-museum');
const waddingtonCustot = require('../venues/w/waddington-custot');
const waterlooEastTheatre = require('../venues/w/waterloo-east-theatre');
const wellHung = require('../venues/w/well-hung');
const wellcomeCollection = require('../venues/w/wellcome-collection');
const whiteBearTheatre = require('../venues/w/white-bear-theatre');
const whiteCubeGalleries = require('../venues/w/white-cube-galleries');
const whiteRainbow = require('../venues/w/white-rainbow');
const whitechapelGallery = require('../venues/w/whitechapel-gallery');
const wilkinsonGallery = require('../venues/w/wilkinson-gallery');
const williamBeningtonGallery = require('../venues/w/william-benington-gallery');
const williamMorrisGallery = require('../venues/w/william-morris-gallery');
const wiltonsMusicHall = require('../venues/w/wiltons-music-hall');
const wimbledonSpace = require('../venues/w/wimbledon-space');
const woolffGallery = require('../venues/w/woolff-gallery');
const yeOldeRoseAndCrownTheatre = require('../venues/y/ye-olde-rose-and-crown-theatre');
const youngVic = require('../venues/y/young-vic');
// const arebyte = require('../venues/a/arebyte');
const artsdepot = require('../venues/a/artsdepot');
const letrangere = require('../venues/l/letrangere');

exports.create = function(venueId) {
  switch (venueId) {
    case '5th-base':
      return fifthBase;
    case '71a-gallery':
      return seventyOneAGallery;
    case 'above-the-stag-theatre':
      return aboveTheStagTheatre;
    case 'albemarle-gallery':
      return albemarleGallery;
    case 'alison-jacques-gallery':
      return alisonJacquesGallery;
    case 'a-side-b-side-gallery':
      return aSideBSideGallery;
    case 'aktis-gallery':
      return aktisGallery;
    case 'alan-cristea-gallery':
      return alanCristeaGallery;
    case 'asc-gallery':
      return ascGallery;
    case 'atlas-gallery':
      return atlasGallery;
    case 'andor-gallery':
      return andorGallery;
    case 'almeida-theatre':
      return almeidaTheatre;
    case 'ambassadors-theatre':
      return ambassadorsTheatre;

    case 'adelphi-theatre':
      return reallyUsefulTheatres('adelphi');
    case 'cambridge-theatre':
      return reallyUsefulTheatres('cambridge');
    case 'her-majestys-theatre':
      return reallyUsefulTheatres('her-majestys');
    case 'london-palladium':
      return reallyUsefulTheatres('london-palladium');
    case 'new-london-theatre':
      return reallyUsefulTheatres('new-london');
    case 'theatre-royal-drury-lane':
      return reallyUsefulTheatres('theatre-royal');

    case 'aldwych-theatre':
      return nederlanderTheatres('Aldwych Theatre');
    case 'dominion-theatre':
      return nederlanderTheatres('Dominion Theatre');

    case 'ambika-p3':
      return ambikaP3;
    case 'annely-juda-fine-art':
      return annelyJudaFineArt;
    case 'anthony-reynolds-gallery':
      return anthonyReynoldsGallery;
    case 'aram-gallery':
      return aramGallery;
    case 'arcade':
      return arcade;
    // case 'arebyte':
    //   return arebyte;
    case 'artsdepot':
      return artsdepot;
    case 'architectural-association':
      return architecturalAssociation;
    case 'arcola-theatre':
      return arcolaTheatre;
    case 'art-first':
      return artFirst;
    case 'arts-theatre':
      return artsTheatre;
    case 'autographabp-rivington-place':
      return autographAbp;

    case 'apollo-victoria-theatre':
      return atgVenues('apollo-victoria-theatre');
    case 'duke-of-yorks-theatre':
      return atgVenues('duke-of-yorks-theatre');
    case 'fortune-theatre':
      return atgVenues('fortune-theatre');
    case 'harold-pinter-theatre':
      return atgVenues('harold-pinter-theatre');
    case 'lyceum-theatre':
      return atgVenues('lyceum-theatre');
    case 'phoenix-theatre':
      return atgVenues('phoenix-theatre');
    case 'piccadilly-theatre':
      return atgVenues('piccadilly-theatre');
    case 'playhouse-theatre':
      return atgVenues('playhouse-theatre');
    case 'savoy-theatre':
      return atgVenues('savoy-theatre');
    case 'trafalgar-studios':
      return atgVenues('trafalgar-studios');

    case 'barbican-centre':
      return barbicanCentre;
    case 'barons-court-theatre':
      return baronsCourtTheatre;
    case 'bartha-contemporary':
      return barthaContemporary;
    case 'battersea-arts-centre':
      return batterseaArtsCentre;
    case 'beaconsfield-gallery-vauxhall':
      return beaconsfieldGalleryVauxhall;
    case 'bearspace':
      return bearspace;
    case 'beers-london':
      return beersLondon;
    case 'ben-brown-fine-arts':
      return benBrownFineArts;
    case 'ben-uri-gallery':
      return benUriGallery;
    case 'bernard-jacobson-gallery':
      return bernardJacobsonGallery;
    case 'bethlem-gallery':
      return bethlemGallery;
    case 'blainorsouthern':
      return blainSouthern;
    case 'block-336':
      return block336;
    case 'bloomberg-space':
      return bloombergSpace;
    case 'bloomsbury-theatre':
      return bloomsburyTheatre;
    case 'breese-little':
      return breeseLittle;
    case 'bridewell-theatre':
      return bridewellTheatre;
    case 'british-library':
      return britishLibrary;
    case 'british-museum':
      return britishMuseum;
    case 'brocket-gallery':
      return brocketGallery;
    case 'brookside-theatre':
      return brooksideTheatre;
    case 'brunei-gallery':
      return bruneiGallery;
    case 'bush-theatre':
      return bushTheatre;
    case 'cadogan-contemporary':
      return cadoganContemporary;
    case 'calvert-22':
      return calvert22;
    case 'canal':
      return canal;
    case 'dilston-grove':
      return cgpVenues('Dilston Grove');
    case 'the-gallery-by-the-pool':
      return cgpVenues('The Gallery');
    case 'chelsea-space':
      return chelseaSpace;
    case 'cnb-gallery':
      return cnbGallery;
    case 'camden-arts-centre':
      return camdenArtsCentre;
    case 'camden-peoples-theatre':
      return camdenPeoplesTheatre;
    case 'carroll-fletcher':
      return carrollFletcher;
    case 'catto-gallery':
      return cattoGallery;
    case 'cell-project-space':
      return cellProjectSpace;
    case 'centre-for-recent-drawing-c4rd':
      return centreForRecentDrawing;
    case 'chelsea-theatre':
      return chelseaTheatre;
    case 'chewdays':
      return chewdays;
    case 'chickenshed-theatre':
      return chickenshedTheatre;
    case 'chisenhale-gallery':
      return chisenhaleGallery;
    case 'crane-kalman-gallery':
      return craneKalmanGallery;
    case 'criterion-theatre':
      return criterionTheatre;
    case 'cubitt-gallery':
      return cubittGallery;
    case 'curious-duke-gallery':
      return curiousDukeGallery;
    case 'd-contemporary':
      return dContemporary;
    case 'danielle-arnaud':
      return danielleArnaud;
    case 'david-gill-gallery':
      return davidGillGallery;
    case 'david-zwirner':
      return davidZwirner;
    case 'gielgud-theatre':
      return delfontMackintoshTheatres('gielgud-theatre');
    case 'noel-coward-theatre':
      return delfontMackintoshTheatres('noel-coward-theatre');
    case 'novello-theatre':
      return delfontMackintoshTheatres('novello-theatre');
    case 'prince-edward-theatre':
      return delfontMackintoshTheatres('prince-edward-theatre');
    case 'prince-of-wales-theatre':
      return delfontMackintoshTheatres('prince-of-wales-theatre');
    case 'queens-theatre':
      return delfontMackintoshTheatres('queens-theatre');
    case 'victoria-palace-theatre':
      return delfontMackintoshTheatres('victoria-palace-theatre');
    case 'wyndhams-theatre':
      return delfontMackintoshTheatres('wyndhams-theatre');
    case 'design-museum':
      return designMuseum;
    case 'donmar-warehouse':
      return donmarWarehouse;
    case 'drawing-room':
      return drawingRoom;
    case 'drayton-arms-theatre':
      return draytonArmsTheatre;
    case 'dreamspace-gallery':
      return dreamspaceGallery;
    case 'dulwich-picture-gallery':
      return dulwichPictureGallery;
    case 'eagle-gallery':
      return eagleGallery;
    case 'edel-assanti':
      return edelAssanti;
    case 'erarta-galleries-london':
      return erartaGalleriesLondon;
    case 'erskine-hall-and-coe':
      return erskineHallAndCoe;
    case 'espacio-gallery':
      return espacioGallery;
    case 'estorick-collection-of-modern-italian-art':
      return estorick;
    case 'exhibit-gallery':
      return exhibitGallery;
    case 'fashion-and-textile-museum':
      return fashionAndTextileMuseum;
    // case 'fashion-space-gallery':
    // // Huge delay
    //   return fashionSpaceGallery;
    case 'finborough-theatre':
      return finboroughTheatre;
    case 'flowers-gallery-cork-street':
      return flowersGalleries('Cork', 'cork-street');
    case 'flowers-gallery-kingsland-road':
      return flowersGalleries('Kingsland', 'kingsland-road');
    case 'fold-gallery':
      return foldGallery;
    case 'formans-smokehouse-gallery':
      return formansSmokehouseGallery;
    case 'four-corners':
      return fourCorners;
    case 'french-riviera':
      return frenchRiviera;
    case 'frith-street-gallery-golden-square':
      return frithStreetGalleries('Golden Square');
    case 'frith-street-gallery-soho-square':
      return frithStreetGalleries('Soho Square');
    case 'furtherfield-gallery':
      return furtherfieldGallery;
    case 'gagosian-gallery-davies-street':
      return gagosianGalleries('Davies Street, London');
    case 'gagosian-gallery-grosvenor-hill':
      return gagosianGalleries('Grosvenor Hill, London');
    case 'gagosian-gallery-brittania-street':
      return gagosianGalleries('Britannia Street, London');
    case 'gallery-elena-shchukina':
      return galleryElenaShchukina;
    // case 'gallery-fumi':
    // // Too slow to respond
    //   return galleryFumi;
    case 'gallery-s-o':
      return gallerySO;
    case 'gasworks-gallery':
      return gasworksGallery;
    case 'gate-theatre':
      return gateTheatre;
    case 'gazelli-art-house':
      return gazelliArtHouse;
    case 'geffrye-museum':
      return geffryeMuseum;
    case 'getty-images-gallery':
      return gettyImagesGallery;
    case 'gimpel-fils':
      return gimpelFils;
    case 'grad2674':
      return grad;
    case 'graffik-gallery':
      return graffikGallery;
    case 'greengrassi':
      return greengrassi;
    case 'greenwood-theatre':
      return greenwoodTheatre;
    case 'hackney-empire':
      return hackneyEmpire;
    case 'halcyon-gallery-144-146-new-bond-street':
      return halcyonGalleries('144-146 New Bond Street, London');
    case 'halcyon-gallery-29-new-bond-street':
      return halcyonGalleries('29 New Bond Street, London');
    case 'hales-gallery':
      return halesGallery;
    case 'hamiltons-gallery':
      return hamiltonsGallery;
    case 'hampstead-theatre':
      return hampsteadTheatre;
    case 'hanmi-gallery':
      return hanmiGallery;
    case 'hannah-barry-gallery':
      return hannahBarryGallery;
    case 'hauser-and-wirth':
      return hauserAndWirth;
    case 'hen-and-chickens-theatre':
      return henAndChickensTheatre;
    case 'howard-griffin-gallery':
      return howardGriffinGallery;
    case 'hoxton-hall-theatre':
      return hoxtonHallTheatre;
    case 'imperial-war-museum-london':
      return imperialWarMuseumLondon;
    case 'imt-gallery':
      return imtGallery;
    case 'institute-of-contemporary-arts':
      return instituteOfContemporaryArts;
    case 'islington-arts-factory':
      return islingtonArtsFactory;
    case 'jack-studio-theatre':
      return jackStudioTheatre;
    case 'jacksons-lane':
      return jacksonsLane;
    case 'james-freeman-gallery':
      return jamesFreemanGallery;
    case 'jermyn-street-theatre':
      return jermynStreetTheatre;
    case 'jerwood-space-gallery':
      return jerwoodSpaceGallery;
    case 'jewish-museum-london':
      return jewishMuseumLondon;
    case 'john-martin-gallery':
      return johnMartinGallery;
    case 'jonathan-cooper':
      return jonathanCooper;
    case 'josh-lilley-gallery':
      return joshLilleyGallery;
    case 'kings-head-theatre':
      return kingsHeadTheatre;
    case 'kings-place':
      return kingsPlace;
    case 'kristin-hjellegjerde-gallery':
      return kristinHjellegjerdeGallery;
    case 'lawrence-alkin-gallery':
      return lawrenceAlkinGallery;
    case 'lazarides-rathbone':
      return lazaridesRathbone;
    case 'letrangere':
      return letrangere;
    case 'leyden-gallery':
      return leydenGallery;
    case 'lion-and-unicorn-theatre':
      return lionAndUnicornTheatre;
    case 'lisson-gallery-27-bell-street':
      return lissonGalleries('27 Bell Street');
    case 'lisson-gallery-52-bell-street':
      return lissonGalleries('52 Bell Street');
    case 'lisson-gallery-67-lisson-street':
      return lissonGalleries('67 Lisson Street');
    case 'london-arts-board':
      return londonArtsBoard;
    case 'london-coliseum':
      return londonColiseum;
    case 'london-transport-museum':
      return londonTransportMuseum;
    case 'lychee-one':
      return lycheeOne;
    case 'lyric-hammersmith':
      return lyricHammersmith;
    case 'matts-gallery':
      return mattsGallery;
    case 'maureen-paley-gallery':
      return maureenPaleyGallery;
    case 'menier-chocolate-factory':
      return menierChocolateFactory;
    case 'menier-gallery':
      return menierGallery;
    case 'mercer-chance':
      return mercerChance;
    case 'michael-hoppen-gallery':
      return michaelHoppenGallery;
    case 'michael-werner-gallery':
      return michaelWernerGallery;
    case 'morley-gallery':
      return morleyGallery;
    case 'narrative-projects':
      return narrativeProjects;
    case 'national-gallery':
      return nationalGallery;
    case 'national-portrait-gallery':
      return nationalPortraitGallery;
    case 'national-theatre':
      return nationalTheatre;
    case 'natural-history-museum':
      return naturalHistoryMuseum;
    case 'new-diorama-theatre':
      return newDioramaTheatre;
    case 'newport-street-gallery':
      return newportStreetGallery;
    case 'apollo-theatre':
      return nimaxTheatres('apollo-theatre');
    case 'duchess-theatre':
      return nimaxTheatres('duchess-theatre');
    case 'garrick-theatre':
      return nimaxTheatres('garrick-theatre');
    case 'lyric-theatre':
      return nimaxTheatres('lyric-theatre');
    case 'palace-theatre':
      return nimaxTheatres('palace-theatre');
    case 'vaudeville-theatre':
      return nimaxTheatres('vaudeville-theatre');
    case 'nunnery-gallery':
      return nunneryGallery;
    case 'october-gallery':
      return octoberGallery;
    case 'old-red-lion-theatre':
      return oldRedLionTheatre;
    case 'olivier-malingue':
      return olivierMalingue;
    case 'orange-tree-theatre':
      return orangeTreeTheatre;
    case 'ovalhouse':
      return ovalhouse;
    case 'pace5406':
      return pace5406;
    case 'pangolin-london':
      return pangolinLondon;
    case 'parasol-unit':
      return parasolUnit;
    case 'park-theatre':
      return parkTheatre;
    case 'peacock-theatre':
      return peacockTheatre;
    case 'peer1482':
      return peer1482;
    case 'phillips':
      return phillips;
    case 'pi-artworks':
      return piArtworks;
    case 'piano-nobile':
      return pianoNobile('Holland Park', 'holland-park');
    case 'piano-nobile-kings-cross':
      return pianoNobile('Kings Place', 'kings-place');
    case 'pilar-corrias-gallery':
      return pilarCorriasGallery;
    case 'pippy-houldsworth-gallery':
      return pippyHouldsworthGallery;
    // Not working:
    // case 'platform-theatre':
    //   return platformTheatre;
    case 'pleasance-theatre':
      return pleasanceTheatre;
    case 'plus-one-gallery':
      return plusOneGallery;
    case 'pmam8768':
      return pmam8768;
    case 'polka-theatre':
      return polkaTheatre;
    case 'pump-house-gallery':
      return pumpHouseGallery;
    case 'purdy-hicks-gallery':
      return purdyHicksGallery;
    case 'putney-arts-theatre':
      return putneyArtsTheatre;
    case 'raven-row':
      return ravenRow;
    case 'rebecca-hossack-charlotte-street':
      return rebeccaHossackGalleries('Charlotte Street');
    case 'rebecca-hossack-conway-street':
      return rebeccaHossackGalleries('Conway Street');
    case 'rebecca-louise-law-gallery':
      return rebeccaLouiseLawGallery;
    case 'regents-park-open-air-theatre':
      return regentsParkOpenAirTheatre;
    case 'riba-headquarters':
      return ribaHeadquarters;
    case 'rich-mix':
      return richMix;
    case 'richard-saltoun':
      return richardSaltoun;
    case 'richard-young-gallery':
      return richardYoungGallery;
    case 'ronchini-gallery':
      return ronchiniGallery;
    case 'rosemary-branch-theatre':
      return rosemaryBranchTheatre;
    case 'rosenfeld-porcini':
      return rosenfeldPorcini;
    case 'roundhouse':
      return roundhouse;
    case 'rowing':
      return rowing;
    case 'royal-academy-of-arts':
      return royalAcademyOfArts;
    case 'royal-court-theatre':
      return royalCourtTheatre;
    case 'royal-opera-house':
      return royalOperaHouse;
    case 'saatchi-gallery':
      return saatchiGallery;
    case 'sadie-coles-davies-street':
      return sadieColesGalleries('Davies Street');
    case 'sadie-coles-kingly-street':
      return sadieColesGalleries('Kingly Street');
    case 'sadlers-wells':
      return sadlersWells;
    case 'serpentine-gallery':
      return serpentineGalleries('Serpentine Gallery');
    case 'serpentine-sackler-gallery':
      return serpentineGalleries('Serpentine Sackler Gallery');
    case 'shaftesbury-theatre':
      return shaftesburyTheatre;
    case 'shakespeares-globe':
      return shakespearesGlobe;
    case 'shaw-theatre':
      return shawTheatre;
    case 'shoreditch-town-hall':
      return shoreditchTownHall;
    case 'skarstedt':
      return skarstedt;
    case 'soho-theatre':
      return sohoTheatre;
    case 'somerset-house':
      return somersetHouse;
    case 'sophia-contemporary-gallery':
      return sophiaContemporaryGallery;
    case 'south-london-gallery':
      return southLondonGallery;
    case 'southard-reid':
      return southardReid;
    case 'southbank-centre':
      return southbankCentre;
    case 'southwark-playhouse':
      return southwarkPlayhouse;
    case 'sprovieri-gallery':
      return sprovieriGallery;
    case 'st-martins-theatre':
      return stMartinsTheatre;
    case 'stolenspace-gallery':
      return stolenspaceGallery;
    case 'store-street-gallery':
      return storeStreetGallery;
    case 'studio-11':
      return studio11;
    case 'studio-voltaire':
      return studioVoltaire;
    case 't-j-boulting':
      return tJBoulting;
    case 'tabard-theatre':
      return tabardTheatre;
    case 'tate-britain':
      return tateGalleries('tate_britain', 'tate-britain');
    case 'tate-modern':
      return tateGalleries('tate_modern', 'tate-modern');
    case 'the-albany':
      return theAlbany;
    case 'the-building-centre':
      return theBuildingCentre;
    case 'the-bunker':
      return theBunker;
    case 'the-clf-theatre':
      return theClfTheatre;
    case 'the-cob-gallery':
      return theCobGallery;
    case 'the-cockpit':
      return theCockpit;
    case 'the-coningsby-gallery':
      return theConingsbyGallery;
    case 'the-courtauld-gallery':
      return theCourtauldGallery;
    case 'the-courtyard-theatre':
      return theCourtyardTheatre;
    case 'the-dot-project':
      return theDotProject;
    case 'the-fitzrovia-gallery':
      return theFitzroviaGallery;
    case 'the-foundry-gallery':
      return theFoundryGallery;
    case 'the-hope-theatre':
      return theHopeTheatre;
    case 'the-london-theatre-new-cross':
      return theLondonTheatreNewCross;
    case 'the-mosaic-rooms':
      return theMosaicRooms;
    case 'the-old-vic':
      return theOldVic;
    case 'the-other-palace':
      return theOtherPalace;
    case 'the-photographers-gallery':
      return thePhotographersGallery;
    case 'the-questors-theatre':
      return theQuestorsTheatre;
    case 'the-residence-gallery':
      return theResidenceGallery;
    case 'the-rose-playhouse':
      return theRosePlayhouse;
    case 'the-ryder-projects':
      return theRyderProjects;
    case 'the-space':
      return theSpace;
    case 'the-vaults':
      return theVaults;
    case 'the-wallace-collection':
      return theWallaceCollection;
    case 'the-yard':
      return theYard;
    // timeout problem:
    case 'theatre-n16':
      return theatreN16;
    case 'theatre-royal-haymarket':
      return theatreRoyalHaymarket;
    case 'theatre-royal-stratford-east':
      return theatreRoyalStratfordEast;
    case 'theatre503':
      return theatre503;
    case 'theatro-technis':
      return theatroTechnis;
    case 'timothy-taylor':
      return timothyTaylor;
    case 'tiwani-contemporary':
      return tiwaniContemporary;
    case 'transition-gallery':
      return transitionGallery;
    case 'tricycle-theatre':
      return tricycleTheatre;
    case 'tristan-bates-theatre':
      return tristanBatesTheatre;
    case 'tristan-hoare':
      return tristanHoare;
    case 'two-temple-place':
      return twoTemplePlace;
    case 'ual-showroom':
      return ualShowroom;
    case 'unicorn-theatre':
      return unicornTheatre;
    case 'union-gallery':
      return unionGallery;
    case 'union-theatre':
      return unionTheatre;
    case 'unit-g-gallery':
      return unitGGallery;
    case 'unit-london':
      return unitLondon;
    case 'upstairs-at-the-gatehouse':
      return upstairsAtTheGatehouse;
    case 'vanda-museum-of-childhood':
      return vAndAMuseumOfChildhood;
    case 'victoria-and-albert-museum':
      return victoriaAndAlbertMuseum;
    case 'victoria-miro-wharf-road':
      return victoriaMiroGalleries('Victoria Miro Gallery');
    case 'victoria-miro-mayfair':
      return victoriaMiroGalleries('Victoria Miro Mayfair');
    case 'vitrine':
      return vitrine;
    case 'waddington-custot':
      return waddingtonCustot;
    case 'waterloo-east-theatre':
      return waterlooEastTheatre;
    case 'well-hung':
      return wellHung;
    case 'wellcome-collection':
      return wellcomeCollection;
    case 'white-bear-theatre':
      return whiteBearTheatre;
    case 'white-cube-bermondsey':
      return whiteCubeGalleries('Bermondsey');
    case 'white-cube-masons-yard':
      return whiteCubeGalleries('Mason\'s Yard');
    case 'white-rainbow':
      return whiteRainbow;
    case 'whitechapel-gallery':
      return whitechapelGallery;
    case 'wilkinson-gallery':
      return wilkinsonGallery;
    case 'william-benington-gallery':
      return williamBeningtonGallery;
    case 'william-morris-gallery':
      return williamMorrisGallery;
    case 'wiltons-music-hall':
      return wiltonsMusicHall;
    case 'wimbledon-space':
      return wimbledonSpace;
    case 'woolff-gallery':
      return woolffGallery;
    case 'ye-olde-rose-and-crown-theatre':
      return yeOldeRoseAndCrownTheatre;
    case 'young-vic':
      return youngVic;

    default:
      return null;
  }
};
