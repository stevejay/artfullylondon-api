import uuidv4 from "uuid/v4";
import * as talentMapper from "../../src/talent-service/mapper";
import * as venueMapper from "../../src/venue-service/mapper";
import * as eventSeriesMapper from "../../src/event-series-service/mapper";
import * as eventMapper from "../../src/event-service/mapper";

export const NORMAL_ADMIN_USER_REQUEST_HEADERS = {
  Authorization:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiY29nbml0bzp1c2VybmFtZSI6IlN0ZXZlIn0.zD8h7GMwyhBnY4ijQzmBaTl57wscAWKCyBuvCOMVRCA"
};

export const INDIVIDUAL_TALENT_ID = "carrie-cracknell-actor";
export const GROUP_TALENT_ID = "the-darkness-artist";

export const createMinimalIndividualRequestTalent = () => {
  return {
    firstNames: "Carrie",
    lastName: "Cracknell",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor",
    version: 3,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    description: undefined,
    descriptionCredit: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined
  };
};

export const createFullIndividualRequestTalent = () => {
  return {
    firstNames: "Carrie",
    lastName: "Cracknell",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor",
    description: "An actor.",
    descriptionCredit: "Description credit",
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      {
        id: "0342826208934d90b801e055152f1d0f",
        ratio: 1.2,
        copyright: "Tate Modern"
      }
    ],
    weSay: "something",
    version: 3,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createMinimalGroupRequestTalent = () => {
  return {
    lastName: "The Darkness",
    status: "Active",
    talentType: "Group",
    commonRole: "Artist",
    version: 3,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    firstNames: undefined,
    description: undefined,
    descriptionCredit: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined
  };
};

export const createFullGroupRequestTalent = () => {
  return {
    lastName: "The Darkness",
    status: "Active",
    talentType: "Group",
    commonRole: "Artist",
    description: "An actor.",
    descriptionCredit: "Description credit",
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      {
        id: "0342826208934d90b801e055152f1d0f",
        ratio: 1.2,
        copyright: "Tate Modern"
      }
    ],
    weSay: "something",
    version: 3,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createMinimalIndividualDbTalent = () => {
  return {
    id: INDIVIDUAL_TALENT_ID,
    firstNames: "Carrie",
    lastName: "Cracknell",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor",
    version: 3,
    schemeVersion: talentMapper.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createFullIndividualDbTalent = () => {
  return {
    id: INDIVIDUAL_TALENT_ID,
    firstNames: "Carrie",
    lastName: "Cracknell",
    status: "Active",
    talentType: "Individual",
    commonRole: "Actor",
    description: "An actor.",
    descriptionCredit: "Description credit",
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      {
        id: "0342826208934d90b801e055152f1d0f",
        ratio: 1.2,
        copyright: "Tate Modern"
      }
    ],
    weSay: "something",
    version: 3,
    schemeVersion: talentMapper.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createFullGroupDbTalent = () => {
  return {
    id: GROUP_TALENT_ID,
    lastName: "The Darkness",
    status: "Active",
    talentType: "Group",
    commonRole: "Artist",
    description: "An actor.",
    descriptionCredit: "Description credit",
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      {
        id: "0342826208934d90b801e055152f1d0f",
        ratio: 1.2,
        copyright: "Tate Modern"
      }
    ],
    weSay: "something",
    version: 3,
    schemeVersion: talentMapper.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createMinimalGroupDbTalent = () => {
  return {
    id: GROUP_TALENT_ID,
    lastName: "The Darkness",
    status: "Active",
    talentType: "Group",
    commonRole: "Artist",
    version: 1,
    schemeVersion: talentMapper.CURRENT_TALENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const MINIMAL_VENUE_ID = "almeida-theatre";
export const FULL_VENUE_ID = "tate-modern";

export const createMinimalRequestVenue = () => {
  return {
    name: "Almeida Theatre",
    status: "Active",
    venueType: "Theatre",
    address: "Almeida St\nIslington",
    postcode: "N1 1TA",
    latitude: 51.539464,
    longitude: -0.103103,
    wheelchairAccessType: "FullAccess",
    disabledBathroomType: "Present",
    hearingFacilitiesType: "HearingLoops",
    version: 2,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
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
    notes: undefined
  };
};

export const createFullRequestVenue = () => {
  return {
    name: "Tate Modern",
    status: "Active",
    venueType: "Art Gallery",
    description: "Some description",
    descriptionCredit: "Some description credit",
    address: "Bankside\nLondon",
    postcode: "SW1 2ER",
    latitude: 51.5398,
    longitude: -0.109,
    wheelchairAccessType: "FullAccess",
    disabledBathroomType: "Present",
    hearingFacilitiesType: "HearingLoops",
    hasPermanentCollection: true,
    email: "boxoffice@tate.co.uk",
    telephone: "020 7359 4404",
    openingTimes: [
      { day: 1, from: "09:00", to: "18:00" },
      { day: 2, from: "09:00", to: "18:00" }
    ],
    additionalOpeningTimes: [
      { date: "2016-02-12", from: "23:00", to: "23:30" }
    ],
    openingTimesClosures: [{ date: "2016-02-10" }, { date: "2016-02-11" }],
    namedClosures: ["ChristmasDay", "NewYearsDay"],
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      { id: "abcd1234abcd1234abcd1234abcd1234", ratio: 1.2, copyright: "Foo" }
    ],
    weSay: "something",
    notes: "hi",
    version: 1,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createMinimalDbVenue = () => {
  return {
    id: MINIMAL_VENUE_ID,
    name: "Almeida Theatre",
    status: "Active",
    venueType: "Theatre",
    address: "Almeida St\nIslington",
    postcode: "N1 1TA",
    latitude: 51.539464,
    longitude: -0.103103,
    wheelchairAccessType: "FullAccess",
    disabledBathroomType: "Present",
    hearingFacilitiesType: "HearingLoops",
    version: 1,
    schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createFullDbVenue = () => {
  return {
    id: FULL_VENUE_ID,
    name: "Tate Modern",
    status: "Active",
    venueType: "Art Gallery",
    description: "Some description",
    descriptionCredit: "Some description credit",
    address: "Bankside\nLondon",
    postcode: "SW1 2ER",
    latitude: 51.5398,
    longitude: -0.109,
    wheelchairAccessType: "FullAccess",
    disabledBathroomType: "Present",
    hearingFacilitiesType: "HearingLoops",
    hasPermanentCollection: true,
    email: "boxoffice@tate.co.uk",
    telephone: "020 7359 4404",
    openingTimes: [
      { day: 1, from: "09:00", to: "18:00" },
      { day: 2, from: "09:00", to: "18:00" }
    ],
    additionalOpeningTimes: [
      { date: "2016-02-12", from: "23:00", to: "23:30" }
    ],
    openingTimesClosures: [{ date: "2016-02-10" }, { date: "2016-02-11" }],
    namedClosures: ["ChristmasDay", "NewYearsDay"],
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      { id: "abcd1234abcd1234abcd1234abcd1234", ratio: 1.2, copyright: "Foo" }
    ],
    weSay: "something",
    notes: "hi",
    version: 1,
    schemeVersion: venueMapper.CURRENT_VENUE_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const EVENT_SERIES_ID = "bang-said-the-gun";

export const createMinimalRequestEventSeries = () => {
  return {
    name: "Bang Said The Gun",
    status: "Active",
    eventSeriesType: "Occasional",
    occurrence: "Third Thursday of each month",
    summary: "A poetry riot",
    description: "Poetry for people who dont like poetry.",
    version: 1,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",

    descriptionCredit: undefined,
    links: undefined,
    images: undefined,
    weSay: undefined
  };
};

export const createFullRequestEventSeries = () => {
  return {
    name: "Bang Said The Gun",
    status: "Active",
    eventSeriesType: "Occasional",
    occurrence: "Third Thursday of each month",
    summary: "A poetry riot",
    description: "Poetry for people who dont like poetry.",
    descriptionCredit: "Some description credit",
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      { id: "abcd1234abcd1234abcd1234abcd1234", ratio: 1.2, copyright: "Foo" }
    ],
    weSay: "something",
    version: 1,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createMinimalDbEventSeries = () => {
  return {
    id: EVENT_SERIES_ID,
    name: "Bang Said The Gun",
    status: "Active",
    eventSeriesType: "Occasional",
    occurrence: "Third Thursday of each month",
    summary: "A poetry riot",
    description: "Poetry for people who dont like poetry.",
    version: 1,
    schemeVersion: eventSeriesMapper.CURRENT_EVENT_SERIES_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const createFullDbEventSeries = () => {
  return {
    id: EVENT_SERIES_ID,
    name: "Bang Said The Gun",
    status: "Active",
    eventSeriesType: "Occasional",
    occurrence: "Third Thursday of each month",
    summary: "A poetry riot",
    description: "Poetry for people who dont like poetry.",
    descriptionCredit: "Some description credit",
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      { id: "abcd1234abcd1234abcd1234abcd1234", ratio: 1.2, copyright: "Foo" }
    ],
    weSay: "something",
    version: 1,
    schemeVersion: eventSeriesMapper.CURRENT_EVENT_SERIES_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11"
  };
};

export const PERFORMANCE_EVENT_ID = "almeida-theatre/2016/taming-of-the-shrew";
export const EXHIBITION_EVENT_ID = "almeida-theatre/2016/taming-of-the-shrew";
export const COURSE_EVENT_ID = "photographers-gallery/2017/taking-pictures";
export const EVENT_EVENT_SERIES_ID = "some-event-series";
export const EVENT_VENUE_ID = "almeida-theatre";
export const EVENT_TALENT_ID = "john-doe";

export const createMinimalPerformanceRequestEvent = () => {
  return {
    status: "Active",
    name: "Taming of the Shrew",
    eventType: "Performance",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    useVenueOpeningTimes: false,
    costType: "Free",
    soldOut: undefined,
    timedEntry: undefined,
    summary: "A Shakespearian classic",
    description: undefined,
    venueId: EVENT_VENUE_ID,
    version: 4,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
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
    soldOutPerformances: undefined
  };
};

export const createMinimalExhibitionRequestEvent = () => {
  return {
    status: "Active",
    name: "Taming of the Shrew",
    eventType: "Exhibition",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    useVenueOpeningTimes: false,
    costType: "Free",
    soldOut: undefined,
    timedEntry: undefined,
    summary: "A Shakespearian classic",
    description: undefined,
    venueId: EVENT_VENUE_ID,
    version: 4,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
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
    soldOutPerformances: undefined
  };
};

export const createFullPerformanceRequestEvent = () => {
  return {
    status: "Active",
    name: "Taming of the Shrew",
    eventType: "Performance",
    occurrenceType: "Bounded",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    costType: "Paid",
    costFrom: 15.5,
    costTo: 35,
    soldOut: false,
    timedEntry: undefined,
    bookingType: "RequiredForNonMembers",
    bookingOpens: "2016-02-11",
    summary: "A contemporary update of this Shakespeare classic",
    description:
      "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
    descriptionCredit: "Some credit",
    rating: 4,
    minAge: 14,
    maxAge: 18,
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    eventSeriesId: EVENT_EVENT_SERIES_ID,
    venueId: EVENT_VENUE_ID,
    venueGuidance:
      "Exhibition is located in the Purcell Room in the Foster Building",
    useVenueOpeningTimes: false,
    timesRanges: [
      {
        id: "all-run",
        label: "all run",
        dateFrom: "2016-02-11",
        dateTo: "2016-02-13"
      }
    ],
    openingTimes: undefined,
    performances: [{ day: 1, at: "18:00", timesRangeId: "all-run" }],
    additionalOpeningTimes: undefined,
    additionalPerformances: [{ date: "2016-02-11", at: "15:00" }],
    specialOpeningTimes: undefined,
    specialPerformances: [
      {
        date: "2016-02-11",
        at: "15:00",
        audienceTags: [{ id: "audience/adult", label: "Adult" }]
      }
    ],
    openingTimesClosures: undefined,
    performancesClosures: [{ date: "2016-12-25" }],
    duration: "01:00",
    talents: [{ id: EVENT_TALENT_ID, roles: ["Director"] }],
    audienceTags: [{ id: "audience/families", label: "families" }],
    mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
    styleTags: [{ id: "style/contemporary", label: "contemporary" }],
    geoTags: [
      { id: "geo/europe", label: "europe" },
      { id: "geo/europe/spain", label: "spain" }
    ],
    images: [
      {
        id: "12345678123456781234567812345678",
        ratio: 1.2,
        copyright: "foo",
        dominantColor: "af0090"
      }
    ],
    reviews: [{ source: "The Guardian", rating: 4 }],
    weSay: "something",
    version: 1,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    soldOutPerformances: [
      {
        date: "2016-02-11",
        at: "15:00"
      }
    ]
  };
};

export const createFullExhibitionRequestEvent = () => {
  return {
    status: "Active",
    name: "Taming of the Shrew",
    eventType: "Exhibition",
    occurrenceType: "Bounded",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    costType: "Paid",
    costFrom: 0,
    costTo: 35,
    soldOut: undefined,
    timedEntry: true,
    bookingType: "RequiredForNonMembers",
    bookingOpens: "2016-02-11",
    summary: "A contemporary update of this Shakespeare classic",
    description:
      "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
    descriptionCredit: "Some credit",
    rating: 4,
    minAge: 14,
    maxAge: 18,
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    eventSeriesId: EVENT_EVENT_SERIES_ID,
    venueId: EVENT_VENUE_ID,
    venueGuidance:
      "Exhibition is located in the Purcell Room in the Foster Building",
    useVenueOpeningTimes: false,
    timesRanges: undefined,
    openingTimes: [{ day: 1, from: "09:00", to: "18:00" }],
    performances: undefined,
    additionalOpeningTimes: [
      { date: "2016-02-11", from: "09:00", to: "18:00" }
    ],
    additionalPerformances: undefined,
    specialOpeningTimes: undefined,
    specialPerformances: undefined,
    openingTimesClosures: [{ date: "2016-12-25" }],
    performancesClosures: undefined,
    duration: "01:00",
    talents: [{ id: EVENT_TALENT_ID, roles: ["Director"] }],
    audienceTags: [{ id: "audience/families", label: "families" }],
    mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
    styleTags: [{ id: "style/contemporary", label: "contemporary" }],
    geoTags: [
      { id: "geo/europe", label: "europe" },
      { id: "geo/europe/spain", label: "spain" }
    ],
    images: [
      {
        id: "12345678123456781234567812345678",
        ratio: 1.2,
        copyright: "foo",
        dominantColor: "af0090"
      }
    ],
    reviews: [{ source: "The Guardian", rating: 4 }],
    weSay: "something",
    version: 1,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    soldOutPerformances: undefined
  };
};

export const createMinimalCourseRequestEvent = () => {
  return {
    status: "Active",
    name: "Picture Taking",
    eventType: "Course",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    useVenueOpeningTimes: false,
    costType: "Free",
    soldOut: undefined,
    timedEntry: undefined,
    summary: "How to take pictures",
    description: undefined,
    venueId: EVENT_VENUE_ID,
    version: 4,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
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
    soldOutPerformances: undefined
  };
};

export const createFullCourseRequestEvent = () => {
  return {
    status: "Active",
    name: "Taking Pictures",
    eventType: "Course",
    occurrenceType: "Bounded",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    costType: "Paid",
    costFrom: 15.5,
    costTo: 35,
    soldOut: true,
    timedEntry: undefined,
    bookingType: "RequiredForNonMembers",
    bookingOpens: "2016-02-11",
    summary: "How to take pictures",
    description: "How to do this thing of taking pictures",
    descriptionCredit: "Some credit",
    rating: 4,
    minAge: 14,
    maxAge: 18,
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    eventSeriesId: EVENT_EVENT_SERIES_ID,
    venueId: EVENT_VENUE_ID,
    venueGuidance:
      "Course is located in the Purcell Room in the Foster Building",
    useVenueOpeningTimes: false,
    timesRanges: undefined,
    openingTimes: undefined,
    performances: undefined,
    additionalOpeningTimes: undefined,
    additionalPerformances: [{ date: "2016-02-11", at: "15:00" }],
    specialOpeningTimes: undefined,
    specialPerformances: undefined,
    openingTimesClosures: undefined,
    performancesClosures: undefined,
    duration: "01:00",
    talents: [{ id: EVENT_TALENT_ID, roles: ["Director"] }],
    audienceTags: [{ id: "audience/families", label: "families" }],
    mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
    styleTags: [{ id: "style/contemporary", label: "contemporary" }],
    geoTags: [
      { id: "geo/europe", label: "europe" },
      { id: "geo/europe/spain", label: "spain" }
    ],
    images: [
      {
        id: "12345678123456781234567812345678",
        ratio: 1.2,
        copyright: "foo",
        dominantColor: "af0090"
      }
    ],
    reviews: [{ source: "The Guardian", rating: 4 }],
    weSay: "something",
    version: 1,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    soldOutPerformances: undefined
  };
};

export const createMinimalPerformanceDbEvent = () => {
  return {
    id: PERFORMANCE_EVENT_ID,
    status: "Active",
    name: "Taming of the Shrew",
    eventType: "Performance",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    useVenueOpeningTimes: false,
    costType: "Paid",
    summary: "A Shakespearian classic",
    version: 4,
    schemeVersion: eventMapper.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    venueId: EVENT_VENUE_ID
  };
};

export const createMinimalCourseDbEvent = () => {
  return {
    id: COURSE_EVENT_ID,
    status: "Active",
    name: "Taking Pictures",
    eventType: "Course",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    useVenueOpeningTimes: false,
    costType: "Free",
    summary: "A Shakespearian classic",
    version: 4,
    schemeVersion: eventMapper.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    venueId: EVENT_VENUE_ID
  };
};

export const createFullPerformanceDbEvent = () => {
  return {
    id: PERFORMANCE_EVENT_ID,
    status: "Active",
    name: "Taming of the Shrew",
    eventType: "Performance",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    minAge: 14,
    maxAge: 18,
    soldOut: true,
    useVenueOpeningTimes: false,
    costType: "Paid",
    summary: "A Shakespearian classic",
    description: "A contemporary update of this Shakespearian classic",
    descriptionCredit: "Description credit",
    version: 4,
    schemeVersion: eventMapper.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    timesRanges: [
      {
        id: "all-run",
        label: "all run",
        dateFrom: "2016-02-11",
        dateTo: "2016-02-13"
      }
    ],
    performances: [{ day: 7, at: "12:00", timesRangeId: "all-run" }],
    additionalPerformances: [{ date: "2016-08-15", at: "08:00" }],
    talents: [{ id: EVENT_TALENT_ID, roles: ["Director"] }],
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      { id: "12345678123456781234567812345678", ratio: 1.2, copyright: "foo" }
    ],
    audienceTags: [{ id: "audience/families", label: "families" }],
    mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
    styleTags: [{ id: "style/contemporary", label: "contemporary" }],
    geoTags: [
      { id: "geo/europe", label: "europe" },
      { id: "geo/spain", label: "spain" }
    ],
    venueId: EVENT_VENUE_ID,
    eventSeriesId: EVENT_EVENT_SERIES_ID,
    duration: "01:00",
    venueGuidance: "Through the curtains",
    reviews: [{ source: "The Guardian", rating: 4 }],
    weSay: "something",
    soldOutPerformances: [{ date: "2016-08-15", at: "08:00" }]
  };
};

export const createFullCourseDbEvent = () => {
  return {
    id: PERFORMANCE_EVENT_ID,
    status: "Active",
    name: "Taking Pictures",
    eventType: "Course",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    minAge: 14,
    maxAge: 18,
    soldOut: true,
    useVenueOpeningTimes: false,
    costType: "Paid",
    summary: "How to take pictures",
    description: "How to do that thing of taking pictures",
    descriptionCredit: "Description credit",
    version: 4,
    schemeVersion: eventMapper.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    additionalPerformances: [{ date: "2016-08-15", at: "08:00" }],
    talents: [{ id: EVENT_TALENT_ID, roles: ["Director"] }],
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      { id: "12345678123456781234567812345678", ratio: 1.2, copyright: "foo" }
    ],
    audienceTags: [{ id: "audience/families", label: "families" }],
    mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
    styleTags: [{ id: "style/contemporary", label: "contemporary" }],
    geoTags: [
      { id: "geo/europe", label: "europe" },
      { id: "geo/spain", label: "spain" }
    ],
    venueId: EVENT_VENUE_ID,
    eventSeriesId: EVENT_EVENT_SERIES_ID,
    duration: "01:00",
    venueGuidance: "Through the curtains",
    reviews: [{ source: "The Guardian", rating: 4 }],
    weSay: "something",
    soldOutPerformances: [{ date: "2016-08-15", at: "08:00" }]
  };
};

export const createFullExhibitionDbEvent = () => {
  return {
    id: PERFORMANCE_EVENT_ID,
    status: "Active",
    name: "Taming of the Shrew",
    eventType: "Exhibition",
    occurrenceType: "Bounded",
    bookingType: "NotRequired",
    dateFrom: "2016-02-11",
    dateTo: "2016-02-13",
    rating: 3,
    minAge: 14,
    maxAge: 18,
    timedEntry: true,
    useVenueOpeningTimes: false,
    costType: "Paid",
    summary: "A Shakespearian classic",
    description: "A contemporary update of this Shakespearian classic",
    descriptionCredit: "Description credit",
    version: 4,
    schemeVersion: eventMapper.CURRENT_EVENT_SCHEME_VERSION,
    createdDate: "2016-01-10",
    updatedDate: "2016-01-11",
    openingTimes: [{ day: 7, from: "12:00", to: "16:00" }],
    additionalOpeningTimes: [
      { date: "2016-08-15", from: "17:00", to: "18:00" }
    ],
    talents: [{ id: EVENT_TALENT_ID, roles: ["Director"] }],
    links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
    images: [
      { id: "12345678123456781234567812345678", ratio: 1.2, copyright: "foo" }
    ],
    audienceTags: [{ id: "audience/families", label: "families" }],
    mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
    styleTags: [{ id: "style/contemporary", label: "contemporary" }],
    geoTags: [
      { id: "geo/europe", label: "europe" },
      { id: "geo/spain", label: "spain" }
    ],
    venueId: EVENT_VENUE_ID,
    eventSeriesId: EVENT_EVENT_SERIES_ID,
    duration: "01:00",
    venueGuidance: "Through the curtains",
    reviews: [{ source: "The Guardian", rating: 4 }],
    weSay: "something"
  };
};

export function createNewVenueBody() {
  return {
    name: uuidv4(),
    version: 1,
    status: "Active",
    hearingFacilitiesType: "Unknown",
    links: [
      {
        type: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Almeida_Theatre"
      },
      { type: "Twitter", url: "https://twitter.com/AlmeidaTheatre" },
      { type: "Homepage", url: "https://www.almeida.co.uk/" },
      { type: "Facebook", url: "https://www.facebook.com/almeidatheatre/" },
      { type: "Access", url: "https://www.almeida.co.uk/access" }
    ],
    postcode: "N1 1TA",
    disabledBathroomType: "Present",
    address: "Almeida St\\nLondon",
    email: "boxoffice@almeida.co.uk",
    longitude: -0.103103,
    images: [
      { id: "eed89908d1aa41a69ec6acc5dc92bc99", ratio: 0.6656905807711079 }
    ],
    telephone: "020 7359 4404",
    description:
      "<p>The Almeida Theatre, opened in 1980, is a 325-seat studio theatre with an international reputation, which takes its name from the street on which it is located, off Upper Street, in the London Borough of Islington. The theatre produces a diverse range of drama. Successful plays often transfer to West End theatres.</p>",
    wheelchairAccessType: "Unknown",
    latitude: 51.539464,
    venueType: "Theatre",
    hasPermanentCollection: false
  };
}

export function createNewEventSeriesBody() {
  return {
    name: uuidv4(),
    version: 1,
    status: "Active",
    eventSeriesType: "Occasional",
    occurrence: "Third Thursday of each month",
    images: [
      {
        id: "89bbe5df833341c88976f2572c0a1557",
        ratio: 1,
        copyright: "Bang Said The Gun"
      }
    ],
    summary: "Stand-up poetry",
    description:
      "<p>Poetry for people who don't like poetry! This event is held on the third Thursday of each month. Each night consists of performances by a number of poets followed by an open mic spot.</p>"
  };
}

export function createNewTalentBody() {
  return {
    lastName: uuidv4(),
    version: 1,
    status: "Active",
    commonRole: "Poet",
    links: [{ type: "Homepage", url: "http://www.byronvincent.com/" }],
    talentType: "Individual",
    firstNames: "Byron"
  };
}

export function createNewEventBody(venueId, talentId, eventSeriesId) {
  return {
    name: uuidv4(),
    version: 1,
    status: "Active",
    eventType: "Exhibition",
    occurrenceType: "Bounded",
    costType: "Free",
    summary:
      "An exhibition of paintings and the rarely seen drawings of the pioneering and visionary architect Zaha Hadid",
    dateFrom: "2017-01-13",
    dateTo: "2017-02-12",
    rating: 3,
    bookingType: "NotRequired",
    useVenueOpeningTimes: true,
    duration: "01:00",
    description:
      "<p>Zaha Hadid is widely regarded as a pioneering and visionary architect whose contribution to the world of architecture was ground-breaking and innovative. The Serpentine presentation, first conceived with Hadid herself, will reveal her as an artist with drawing at the very heart of her work and will include the architect’s calligraphic drawings and rarely seen private notebooks with sketches that reveal her complex thoughts about architectural forms and their relationships. The show will focus on Hadid’s early works before her first building was erected in 1993 (Vitra Fire Station in Germany) and present her paintings and drawings from the 1970s to the early 1990s.</p>",
    descriptionCredit: "Serpentine Gallery",
    mediumTags: [
      { id: "medium/drawing", label: "drawing" },
      { id: "medium/painting", label: "painting" },
      { id: "medium/architecture", label: "architecture" }
    ],
    styleTags: [
      { id: "style/contemporary", label: "contemporary" },
      { id: "style/neo-futurist", label: "neo-futurist" }
    ],
    talents: [{ entityType: "talent", id: talentId, roles: ["Artist"] }],
    links: [
      {
        type: "Homepage",
        url:
          "http://www.serpentinegalleries.org/exhibitions-events/zaha-hadid-early-paintings-and-drawings"
      }
    ],
    images: [
      {
        copyright: "'Metropolis', 1988; Copyright Zaha Hadid Architects",
        id: "1b2c8f796791404baa7b59fa7e8f8e8a",
        ratio: 0.43567251461988304
      }
    ],
    eventSeriesId,
    venueId
  };
}
