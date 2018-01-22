'use strict';

const talentConstants = require('../lib/talent/constants');
const venueConstants = require('../lib/venue/constants');
const eventSeriesConstants = require('../lib/event-series/constants');
const eventConstants = require('../lib/event/constants');

exports.NORMAL_ADMIN_USER_REQUEST_HEADERS = {
  Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY29nbml0bzp1c2VybmFtZSI6IlN0ZXZlIn0.zD8h7GMwyhBnY4ijQzmBaTl57wscAWKCyBuvCOMVRCA',
};

exports.INDIVIDUAL_TALENT_ID = 'carrie-cracknell-actor';
exports.GROUP_TALENT_ID = 'the-darkness-artist';

exports.createMinimalIndividualRequestTalent = () => {
  return {
    firstNames: 'Carrie',
    lastName: 'Cracknell',
    status: 'Active',
    talentType: 'Individual',
    commonRole: 'Actor',
    version: 3,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    description: undefined,
    descriptionCredit: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined,
  };
};

exports.createFullIndividualRequestTalent = () => {
  return {
    firstNames: 'Carrie',
    lastName: 'Cracknell',
    status: 'Active',
    talentType: 'Individual',
    commonRole: 'Actor',
    description: 'An actor.',
    descriptionCredit: 'Description credit',
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      {
        id: '0342826208934d90b801e055152f1d0f',
        ratio: 1.2,
        copyright: 'Tate Modern',
      },
    ],
    weSay: 'something',
    version: 3,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createMinimalGroupRequestTalent = () => {
  return {
    lastName: 'The Darkness',
    status: 'Active',
    talentType: 'Group',
    commonRole: 'Artist',
    version: 3,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    firstNames: undefined,
    description: undefined,
    descriptionCredit: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined,
  };
};

exports.createFullGroupRequestTalent = () => {
  return {
    lastName: 'The Darkness',
    status: 'Active',
    talentType: 'Group',
    commonRole: 'Artist',
    description: 'An actor.',
    descriptionCredit: 'Description credit',
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      {
        id: '0342826208934d90b801e055152f1d0f',
        ratio: 1.2,
        copyright: 'Tate Modern',
      },
    ],
    weSay: 'something',
    version: 3,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createMinimalIndividualDbTalent = () => {
  return {
    id: exports.INDIVIDUAL_TALENT_ID,
    firstNames: 'Carrie',
    lastName: 'Cracknell',
    status: 'Active',
    talentType: 'Individual',
    commonRole: 'Actor',
    version: 3,
    schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createFullIndividualDbTalent = () => {
  return {
    id: exports.INDIVIDUAL_TALENT_ID,
    firstNames: 'Carrie',
    lastName: 'Cracknell',
    status: 'Active',
    talentType: 'Individual',
    commonRole: 'Actor',
    description: 'An actor.',
    descriptionCredit: 'Description credit',
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      {
        id: '0342826208934d90b801e055152f1d0f',
        ratio: 1.2,
        copyright: 'Tate Modern',
      },
    ],
    weSay: 'something',
    version: 3,
    schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createFullGroupDbTalent = () => {
  return {
    id: exports.GROUP_TALENT_ID,
    lastName: 'The Darkness',
    status: 'Active',
    talentType: 'Group',
    commonRole: 'Artist',
    description: 'An actor.',
    descriptionCredit: 'Description credit',
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      {
        id: '0342826208934d90b801e055152f1d0f',
        ratio: 1.2,
        copyright: 'Tate Modern',
      },
    ],
    weSay: 'something',
    version: 3,
    schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createMinimalGroupDbTalent = () => {
  return {
    id: exports.GROUP_TALENT_ID,
    lastName: 'The Darkness',
    status: 'Active',
    talentType: 'Group',
    commonRole: 'Artist',
    version: 1,
    schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.MINIMAL_VENUE_ID = 'almeida-theatre';
exports.FULL_VENUE_ID = 'tate-modern';

exports.createMinimalRequestVenue = () => {
  return {
    name: 'Almeida Theatre',
    status: 'Active',
    venueType: 'Theatre',
    address: 'Almeida St\nIslington',
    postcode: 'N1 1TA',
    latitude: 51.539464,
    longitude: -0.103103,
    wheelchairAccessType: 'FullAccess',
    disabledBathroomType: 'Present',
    hearingFacilitiesType: 'HearingLoops',
    version: 2,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    hasPermanentCollection: true,

    description: undefined,
    descriptionCredit: undefined,
    email: undefined,
    telephone: undefined,
    openingTimes: undefined,
    openingTimesClosures: undefined,
    namedClosures: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined,
    notes: undefined,
  };
};

exports.createFullRequestVenue = () => {
  return {
    name: 'Tate Modern',
    status: 'Active',
    venueType: 'Art Gallery',
    description: 'Some description',
    descriptionCredit: 'Some description credit',
    address: 'Bankside\nLondon',
    postcode: 'SW1 2ER',
    latitude: 51.5398,
    longitude: -0.109,
    wheelchairAccessType: 'FullAccess',
    disabledBathroomType: 'Present',
    hearingFacilitiesType: 'HearingLoops',
    hasPermanentCollection: true,
    email: 'boxoffice@tate.co.uk',
    telephone: '020 7359 4404',
    openingTimes: [
      { day: 0, from: '09:00', to: '18:00' },
      { day: 1, from: '09:00', to: '18:00' },
    ],
    additionalOpeningTimes: [
      { date: '2016/02/12', from: '23:00', to: '23:30' },
    ],
    openingTimesClosures: [{ date: '2016/02/10' }, { date: '2016/02/11' }],
    namedClosures: ['ChristmasDay', 'NewYearsDay'],
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      { id: 'abcd1234abcd1234abcd1234abcd1234', ratio: 1.2, copyright: 'Foo' },
    ],
    weSay: 'something',
    notes: 'hi',
    version: 1,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createMinimalDbVenue = () => {
  return {
    id: exports.MINIMAL_VENUE_ID,
    name: 'Almeida Theatre',
    status: 'Active',
    venueType: 'Theatre',
    address: 'Almeida St\nIslington',
    postcode: 'N1 1TA',
    latitude: 51.539464,
    longitude: -0.103103,
    wheelchairAccessType: 'FullAccess',
    disabledBathroomType: 'Present',
    hearingFacilitiesType: 'HearingLoops',
    version: 1,
    schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createFullDbVenue = () => {
  return {
    id: exports.FULL_VENUE_ID,
    name: 'Tate Modern',
    status: 'Active',
    venueType: 'Art Gallery',
    description: 'Some description',
    descriptionCredit: 'Some description credit',
    address: 'Bankside\nLondon',
    postcode: 'SW1 2ER',
    latitude: 51.5398,
    longitude: -0.109,
    wheelchairAccessType: 'FullAccess',
    disabledBathroomType: 'Present',
    hearingFacilitiesType: 'HearingLoops',
    hasPermanentCollection: true,
    email: 'boxoffice@tate.co.uk',
    telephone: '020 7359 4404',
    openingTimes: [
      { day: 0, from: '09:00', to: '18:00' },
      { day: 1, from: '09:00', to: '18:00' },
    ],
    additionalOpeningTimes: [
      { date: '2016/02/12', from: '23:00', to: '23:30' },
    ],
    openingTimesClosures: [{ date: '2016/02/10' }, { date: '2016/02/11' }],
    namedClosures: ['ChristmasDay', 'NewYearsDay'],
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      { id: 'abcd1234abcd1234abcd1234abcd1234', ratio: 1.2, copyright: 'Foo' },
    ],
    weSay: 'something',
    notes: 'hi',
    version: 1,
    schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.EVENT_SERIES_ID = 'bang-said-the-gun';

exports.createMinimalRequestEventSeries = () => {
  return {
    name: 'Bang Said The Gun',
    status: 'Active',
    eventSeriesType: 'Occasional',
    occurrence: 'Third Thursday of each month',
    summary: 'A poetry riot',
    description: 'Poetry for people who dont like poetry.',
    version: 1,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',

    descriptionCredit: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined,
  };
};

exports.createFullRequestEventSeries = () => {
  return {
    name: 'Bang Said The Gun',
    status: 'Active',
    eventSeriesType: 'Occasional',
    occurrence: 'Third Thursday of each month',
    summary: 'A poetry riot',
    description: 'Poetry for people who dont like poetry.',
    descriptionCredit: 'Some description credit',
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      { id: 'abcd1234abcd1234abcd1234abcd1234', ratio: 1.2, copyright: 'Foo' },
    ],
    weSay: 'something',
    version: 1,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createMinimalDbEventSeries = () => {
  return {
    id: exports.EVENT_SERIES_ID,
    name: 'Bang Said The Gun',
    status: 'Active',
    eventSeriesType: 'Occasional',
    occurrence: 'Third Thursday of each month',
    summary: 'A poetry riot',
    description: 'Poetry for people who dont like poetry.',
    version: 1,
    schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.createFullDbEventSeries = () => {
  return {
    id: exports.EVENT_SERIES_ID,
    name: 'Bang Said The Gun',
    status: 'Active',
    eventSeriesType: 'Occasional',
    occurrence: 'Third Thursday of each month',
    summary: 'A poetry riot',
    description: 'Poetry for people who dont like poetry.',
    descriptionCredit: 'Some description credit',
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      { id: 'abcd1234abcd1234abcd1234abcd1234', ratio: 1.2, copyright: 'Foo' },
    ],
    weSay: 'something',
    version: 1,
    schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
  };
};

exports.PERFORMANCE_EVENT_ID = 'almeida-theatre/2016/taming-of-the-shrew';
exports.EXHIBITION_EVENT_ID = 'almeida-theatre/2016/taming-of-the-shrew';
exports.COURSE_EVENT_ID = 'photographers-gallery/2017/taking-pictures';
exports.EVENT_EVENT_SERIES_ID = 'some-event-series';
exports.EVENT_VENUE_ID = 'almeida-theatre';
exports.EVENT_TALENT_ID = 'john-doe';

exports.createMinimalPerformanceRequestEvent = () => {
  return {
    status: 'Active',
    name: 'Taming of the Shrew',
    eventType: 'Performance',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    useVenueOpeningTimes: false,
    costType: 'Free',
    soldOut: undefined,
    timedEntry: undefined,
    summary: 'A Shakespearian classic',
    description: undefined,
    venueId: exports.EVENT_VENUE_ID,
    version: 4,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    costFrom: undefined,
    costTo: undefined,
    minAge: undefined,
    maxAge: undefined,
    eventSeriesId: undefined,
    descriptionCredit: undefined,
    links: undefined,
    duration: undefined,
    venueGuidance: undefined,
    timesRanges: undefined,
    openingTimes: undefined,
    performances: undefined,
    additionalOpeningTimes: undefined,
    additionalPerformances: undefined,
    specialOpeningTimes: undefined,
    specialPerformances: undefined,
    openingTimesClosures: undefined,
    performancesClosures: undefined,
    talents: undefined,
    audienceTags: undefined,
    mediumTags: undefined,
    styleTags: undefined,
    geoTags: undefined,
    images: undefined,
    reviews: undefined,
    weSay: undefined,
    soldOutPerformances: undefined,
  };
};

exports.createMinimalExhibitionRequestEvent = () => {
  return {
    status: 'Active',
    name: 'Taming of the Shrew',
    eventType: 'Exhibition',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    useVenueOpeningTimes: false,
    costType: 'Free',
    soldOut: undefined,
    timedEntry: undefined,
    summary: 'A Shakespearian classic',
    description: undefined,
    venueId: exports.EVENT_VENUE_ID,
    version: 4,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    costFrom: undefined,
    costTo: undefined,
    minAge: undefined,
    maxAge: undefined,
    eventSeriesId: undefined,
    descriptionCredit: undefined,
    links: undefined,
    duration: undefined,
    venueGuidance: undefined,
    timesRanges: undefined,
    openingTimes: undefined,
    performances: undefined,
    additionalOpeningTimes: undefined,
    additionalPerformances: undefined,
    specialOpeningTimes: undefined,
    specialPerformances: undefined,
    openingTimesClosures: undefined,
    performancesClosures: undefined,
    talents: undefined,
    audienceTags: undefined,
    mediumTags: undefined,
    styleTags: undefined,
    geoTags: undefined,
    images: undefined,
    reviews: undefined,
    weSay: undefined,
    soldOutPerformances: undefined,
  };
};

exports.createFullPerformanceRequestEvent = () => {
  return {
    status: 'Active',
    name: 'Taming of the Shrew',
    eventType: 'Performance',
    occurrenceType: 'Bounded',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    costType: 'Paid',
    costFrom: 15.50,
    costTo: 35,
    soldOut: false,
    timedEntry: undefined,
    bookingType: 'RequiredForNonMembers',
    bookingOpens: '2016/02/11',
    summary: 'A contemporary update of this Shakespeare classic',
    description: 'A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.',
    descriptionCredit: 'Some credit',
    rating: 4,
    minAge: 14,
    maxAge: 18,
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    eventSeriesId: exports.EVENT_EVENT_SERIES_ID,
    venueId: exports.EVENT_VENUE_ID,
    venueGuidance: 'Exhibition is located in the Purcell Room in the Foster Building',
    useVenueOpeningTimes: false,
    timesRanges: [
      {
        id: 'all-run',
        label: 'all run',
        dateFrom: '2016/02/11',
        dateTo: '2016/02/13',
      },
    ],
    openingTimes: undefined,
    performances: [{ day: 0, at: '18:00', timesRangeId: 'all-run' }],
    additionalOpeningTimes: undefined,
    additionalPerformances: [{ date: '2016/02/11', at: '15:00' }],
    specialOpeningTimes: undefined,
    specialPerformances: [
      {
        date: '2016/02/11',
        at: '15:00',
        audienceTags: [{ id: 'audience/adult', label: 'Adult' }],
      },
    ],
    openingTimesClosures: undefined,
    performancesClosures: [{ date: '2016/12/25' }],
    duration: '01:00',
    talents: [{ id: exports.EVENT_TALENT_ID, roles: ['Director'] }],
    audienceTags: [{ id: 'audience/families', label: 'families' }],
    mediumTags: [{ id: 'medium/sculpture', label: 'sculpture' }],
    styleTags: [{ id: 'style/contemporary', label: 'contemporary' }],
    geoTags: [
      { id: 'geo/europe', label: 'europe' },
      { id: 'geo/europe/spain', label: 'spain' },
    ],
    images: [
      {
        id: '12345678123456781234567812345678',
        ratio: 1.2,
        copyright: 'foo',
        dominantColor: 'af0090',
      },
    ],
    reviews: [{ source: 'The Guardian', rating: 4 }],
    weSay: 'something',
    version: 1,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    soldOutPerformances: [
      {
        date: '2016/02/11',
        at: '15:00',
      },
    ],
  };
};

exports.createFullExhibitionRequestEvent = () => {
  return {
    status: 'Active',
    name: 'Taming of the Shrew',
    eventType: 'Exhibition',
    occurrenceType: 'Bounded',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    costType: 'Paid',
    costFrom: 0,
    costTo: 35,
    soldOut: undefined,
    timedEntry: true,
    bookingType: 'RequiredForNonMembers',
    bookingOpens: '2016/02/11',
    summary: 'A contemporary update of this Shakespeare classic',
    description: 'A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.',
    descriptionCredit: 'Some credit',
    rating: 4,
    minAge: 14,
    maxAge: 18,
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    eventSeriesId: exports.EVENT_EVENT_SERIES_ID,
    venueId: exports.EVENT_VENUE_ID,
    venueGuidance: 'Exhibition is located in the Purcell Room in the Foster Building',
    useVenueOpeningTimes: false,
    timesRanges: undefined,
    openingTimes: [{ day: 0, from: '09:00', to: '18:00' }],
    performances: undefined,
    additionalOpeningTimes: [
      { date: '2016/02/11', from: '09:00', to: '18:00' },
    ],
    additionalPerformances: undefined,
    specialOpeningTimes: undefined,
    specialPerformances: undefined,
    openingTimesClosures: [{ date: '2016/12/25' }],
    performancesClosures: undefined,
    duration: '01:00',
    talents: [{ id: exports.EVENT_TALENT_ID, roles: ['Director'] }],
    audienceTags: [{ id: 'audience/families', label: 'families' }],
    mediumTags: [{ id: 'medium/sculpture', label: 'sculpture' }],
    styleTags: [{ id: 'style/contemporary', label: 'contemporary' }],
    geoTags: [
      { id: 'geo/europe', label: 'europe' },
      { id: 'geo/europe/spain', label: 'spain' },
    ],
    images: [
      {
        id: '12345678123456781234567812345678',
        ratio: 1.2,
        copyright: 'foo',
        dominantColor: 'af0090',
      },
    ],
    reviews: [{ source: 'The Guardian', rating: 4 }],
    weSay: 'something',
    version: 1,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    soldOutPerformances: undefined,
  };
};

exports.createMinimalCourseRequestEvent = () => {
  return {
    status: 'Active',
    name: 'Picture Taking',
    eventType: 'Course',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    useVenueOpeningTimes: false,
    costType: 'Free',
    soldOut: undefined,
    timedEntry: undefined,
    summary: 'How to take pictures',
    description: undefined,
    venueId: exports.EVENT_VENUE_ID,
    version: 4,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    costFrom: undefined,
    costTo: undefined,
    minAge: undefined,
    maxAge: undefined,
    eventSeriesId: undefined,
    descriptionCredit: undefined,
    links: undefined,
    duration: undefined,
    venueGuidance: undefined,
    timesRanges: undefined,
    openingTimes: undefined,
    performances: undefined,
    additionalOpeningTimes: undefined,
    additionalPerformances: undefined,
    specialOpeningTimes: undefined,
    specialPerformances: undefined,
    openingTimesClosures: undefined,
    performancesClosures: undefined,
    talents: undefined,
    audienceTags: undefined,
    mediumTags: undefined,
    styleTags: undefined,
    geoTags: undefined,
    images: undefined,
    reviews: undefined,
    weSay: undefined,
    soldOutPerformances: undefined,
  };
};

exports.createFullCourseRequestEvent = () => {
  return {
    status: 'Active',
    name: 'Taking Pictures',
    eventType: 'Course',
    occurrenceType: 'Bounded',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    costType: 'Paid',
    costFrom: 15.50,
    costTo: 35,
    soldOut: true,
    timedEntry: undefined,
    bookingType: 'RequiredForNonMembers',
    bookingOpens: '2016/02/11',
    summary: 'How to take pictures',
    description: 'How to do this thing of taking pictures',
    descriptionCredit: 'Some credit',
    rating: 4,
    minAge: 14,
    maxAge: 18,
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    eventSeriesId: exports.EVENT_EVENT_SERIES_ID,
    venueId: exports.EVENT_VENUE_ID,
    venueGuidance: 'Course is located in the Purcell Room in the Foster Building',
    useVenueOpeningTimes: false,
    timesRanges: undefined,
    openingTimes: undefined,
    performances: undefined,
    additionalOpeningTimes: undefined,
    additionalPerformances: [{ date: '2016/02/11', at: '15:00' }],
    specialOpeningTimes: undefined,
    specialPerformances: undefined,
    openingTimesClosures: undefined,
    performancesClosures: undefined,
    duration: '01:00',
    talents: [{ id: exports.EVENT_TALENT_ID, roles: ['Director'] }],
    audienceTags: [{ id: 'audience/families', label: 'families' }],
    mediumTags: [{ id: 'medium/sculpture', label: 'sculpture' }],
    styleTags: [{ id: 'style/contemporary', label: 'contemporary' }],
    geoTags: [
      { id: 'geo/europe', label: 'europe' },
      { id: 'geo/europe/spain', label: 'spain' },
    ],
    images: [
      {
        id: '12345678123456781234567812345678',
        ratio: 1.2,
        copyright: 'foo',
        dominantColor: 'af0090',
      },
    ],
    reviews: [{ source: 'The Guardian', rating: 4 }],
    weSay: 'something',
    version: 1,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    soldOutPerformances: undefined,
  };
};

exports.createMinimalPerformanceDbEvent = () => {
  return {
    id: exports.PERFORMANCE_EVENT_ID,
    status: 'Active',
    name: 'Taming of the Shrew',
    eventType: 'Performance',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    useVenueOpeningTimes: false,
    costType: 'Paid',
    summary: 'A Shakespearian classic',
    version: 4,
    schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    venueId: exports.EVENT_VENUE_ID,
  };
};

exports.createMinimalCourseDbEvent = () => {
  return {
    id: exports.COURSE_EVENT_ID,
    status: 'Active',
    name: 'Taking Pictures',
    eventType: 'Course',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    useVenueOpeningTimes: false,
    costType: 'Free',
    summary: 'A Shakespearian classic',
    version: 4,
    schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    venueId: exports.EVENT_VENUE_ID,
  };
};

exports.createFullPerformanceDbEvent = () => {
  return {
    id: exports.PERFORMANCE_EVENT_ID,
    status: 'Active',
    name: 'Taming of the Shrew',
    eventType: 'Performance',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    minAge: 14,
    maxAge: 18,
    soldOut: true,
    useVenueOpeningTimes: false,
    costType: 'Paid',
    summary: 'A Shakespearian classic',
    description: 'A contemporary update of this Shakespearian classic',
    descriptionCredit: 'Description credit',
    version: 4,
    schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    timesRanges: [
      {
        id: 'all-run',
        label: 'all run',
        dateFrom: '2016/02/11',
        dateTo: '2016/02/13',
      },
    ],
    performances: [{ day: 6, at: '12:00', timesRangeId: 'all-run' }],
    additionalPerformances: [{ date: '2016/08/15', at: '08:00' }],
    talents: [{ id: exports.EVENT_TALENT_ID, roles: ['Director'] }],
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      { id: '12345678123456781234567812345678', ratio: 1.2, copyright: 'foo' },
    ],
    audienceTags: [{ id: 'audience/families', label: 'families' }],
    mediumTags: [{ id: 'medium/sculpture', label: 'sculpture' }],
    styleTags: [{ id: 'style/contemporary', label: 'contemporary' }],
    geoTags: [
      { id: 'geo/europe', label: 'europe' },
      { id: 'geo/spain', label: 'spain' },
    ],
    venueId: exports.EVENT_VENUE_ID,
    eventSeriesId: exports.EVENT_EVENT_SERIES_ID,
    duration: '01:00',
    venueGuidance: 'Through the curtains',
    reviews: [{ source: 'The Guardian', rating: 4 }],
    weSay: 'something',
    soldOutPerformances: [{ date: '2016/08/15', at: '08:00' }],
  };
};

exports.createFullCourseDbEvent = () => {
  return {
    id: exports.PERFORMANCE_EVENT_ID,
    status: 'Active',
    name: 'Taking Pictures',
    eventType: 'Course',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    minAge: 14,
    maxAge: 18,
    soldOut: true,
    useVenueOpeningTimes: false,
    costType: 'Paid',
    summary: 'How to take pictures',
    description: 'How to do that thing of taking pictures',
    descriptionCredit: 'Description credit',
    version: 4,
    schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    additionalPerformances: [{ date: '2016/08/15', at: '08:00' }],
    talents: [{ id: exports.EVENT_TALENT_ID, roles: ['Director'] }],
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      { id: '12345678123456781234567812345678', ratio: 1.2, copyright: 'foo' },
    ],
    audienceTags: [{ id: 'audience/families', label: 'families' }],
    mediumTags: [{ id: 'medium/sculpture', label: 'sculpture' }],
    styleTags: [{ id: 'style/contemporary', label: 'contemporary' }],
    geoTags: [
      { id: 'geo/europe', label: 'europe' },
      { id: 'geo/spain', label: 'spain' },
    ],
    venueId: exports.EVENT_VENUE_ID,
    eventSeriesId: exports.EVENT_EVENT_SERIES_ID,
    duration: '01:00',
    venueGuidance: 'Through the curtains',
    reviews: [{ source: 'The Guardian', rating: 4 }],
    weSay: 'something',
    soldOutPerformances: [{ date: '2016/08/15', at: '08:00' }],
  };
};

exports.createFullExhibitionDbEvent = () => {
  return {
    id: exports.PERFORMANCE_EVENT_ID,
    status: 'Active',
    name: 'Taming of the Shrew',
    eventType: 'Exhibition',
    occurrenceType: 'Bounded',
    bookingType: 'NotRequired',
    dateFrom: '2016/02/11',
    dateTo: '2016/02/13',
    rating: 3,
    minAge: 14,
    maxAge: 18,
    timedEntry: true,
    useVenueOpeningTimes: false,
    costType: 'Paid',
    summary: 'A Shakespearian classic',
    description: 'A contemporary update of this Shakespearian classic',
    descriptionCredit: 'Description credit',
    version: 4,
    schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: '2016/01/10',
    updatedDate: '2016/01/11',
    openingTimes: [{ day: 6, from: '12:00', to: '16:00' }],
    additionalOpeningTimes: [
      { date: '2016/08/15', from: '17:00', to: '18:00' },
    ],
    talents: [{ id: exports.EVENT_TALENT_ID, roles: ['Director'] }],
    links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
    images: [
      { id: '12345678123456781234567812345678', ratio: 1.2, copyright: 'foo' },
    ],
    audienceTags: [{ id: 'audience/families', label: 'families' }],
    mediumTags: [{ id: 'medium/sculpture', label: 'sculpture' }],
    styleTags: [{ id: 'style/contemporary', label: 'contemporary' }],
    geoTags: [
      { id: 'geo/europe', label: 'europe' },
      { id: 'geo/spain', label: 'spain' },
    ],
    venueId: exports.EVENT_VENUE_ID,
    eventSeriesId: exports.EVENT_EVENT_SERIES_ID,
    duration: '01:00',
    venueGuidance: 'Through the curtains',
    reviews: [{ source: 'The Guardian', rating: 4 }],
    weSay: 'something',
  };
};
