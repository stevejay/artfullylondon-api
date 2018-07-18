export const EVENT_SERIES_QUERY = `
query GetEventSeries($id: ID!) {
  eventSeries(id: $id) {
    id
    name
    summary
  }
}
`;

export const EVENT_SERIES_FOR_EDIT_QUERY = `
query GetEventSeriesForEdit($id: ID!) {
  eventSeriesForEdit(id: $id) {
    id
    name
    summary
    version
  }
}
`;

export const CREATE_EVENT_SERIES_MUTATION = `
mutation CreateEventSeries(
  $status: StatusTypeEnum!
  $links: [LinkInput!]
  $images: [ImageInput!]
  $weSay: String
  $notes: String
  $description: String
  $descriptionCredit: String
  $name: String!
  $eventSeriesType: EventSeriesTypeEnum!
  $occurrence: String!
  $summary: String!
) {
  createEventSeries(input: {
    status: $status
    links: $links
    images: $images
    weSay: $weSay
    notes: $notes
    description: $description
    descriptionCredit: $descriptionCredit
    name: $name
    eventSeriesType: $eventSeriesType
    occurrence: $occurrence
    summary: $summary
  }) {
    node {
      id
      name
      summary
    }
  }
}
`;

export const UPDATE_EVENT_SERIES_MUTATION = `
mutation UpdateEventSeries(
  $id: ID!
  $status: StatusTypeEnum!
  $version: Int!
  $links: [LinkInput!]
  $images: [ImageInput!]
  $weSay: String
  $notes: String
  $description: String
  $descriptionCredit: String
  $name: String!
  $eventSeriesType: EventSeriesTypeEnum!
  $occurrence: String!
  $summary: String!
) {
  updateEventSeries(input: {
    id: $id
    status: $status
    version: $version
    links: $links
    images: $images
    weSay: $weSay
    notes: $notes
    description: $description
    descriptionCredit: $descriptionCredit
    name: $name
    eventSeriesType: $eventSeriesType
    occurrence: $occurrence
    summary: $summary
  }) {
    node {
      id
      name
      summary
    }
  }
}
`;

export const EVENT_QUERY = `
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      summary
      venue {
        id
      }
      eventSeries {
        id
      }
      talents {
        talent {
          id
        }
      }
    }
  }
`;

export const EVENT_FOR_EDIT_QUERY = `
  query GetEventForEdit($id: ID!) {
    eventForEdit(id: $id) {
      id
      name
      summary
      version
      venueId
      eventSeriesId
      talents {
        id
      }
    }
  }
`;

export const CREATE_EVENT_MUTATION = `
  mutation CreateEvent(
    $status: StatusTypeEnum!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $eventType: EventTypeEnum!
    $occurrenceType: OccurrenceTypeEnum!
    $costType: CostTypeEnum!
    $summary: String!
    $rating: Int!
    $bookingType: BookingTypeEnum!
    $venueId: ID!
    $eventSeriesId: ID
    $useVenueOpeningTimes: Boolean!
    $dateFrom: IsoShortDate
    $dateTo: IsoShortDate
    $costFrom: Float
    $costTo: Float
    $bookingOpens: IsoShortDate
    $venueGuidance: String
    $duration: ShortTime
    $minAge: Int
    $maxAge: Int
    $soldOut: Boolean
    $timedEntry: Boolean
    $timesRanges: [TimesRangeInput!]
    $performances: [DayPerformanceInput!]
    $additionalPerformances: [DatePerformanceInput!]
    $specialPerformances: [SpecialPerformanceInput!]
    $performancesClosures: [DateClosedTimeAtInput!]
    $soldOutPerformances: [DatePerformanceInput!]
    $openingTimes: [DayOpeningTimeInput!]
    $additionalOpeningTimes: [DateOpeningTimeInput!]
    $specialOpeningTimes: [SpecialOpeningTimeInput!]
    $openingTimesClosures: [DateClosedTimeRangeInput!]
    $audienceTags: [TagInput!]
    $mediumTags: [TagInput!]
    $styleTags: [TagInput!]
    $geoTags: [TagInput!]
    $talents: [EventTalentInput!]
    $reviews: [ReviewInput!]
  ) {
    createEvent(input: {
      status: $status
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      eventType: $eventType
      occurrenceType: $occurrenceType
      costType: $costType
      summary: $summary
      rating: $rating
      bookingType: $bookingType
      venueId: $venueId
      eventSeriesId: $eventSeriesId
      useVenueOpeningTimes: $useVenueOpeningTimes
      dateFrom: $dateFrom
      dateTo: $dateTo
      costFrom: $costFrom
      costTo: $costTo
      bookingOpens: $bookingOpens
      venueGuidance: $venueGuidance
      duration: $duration
      minAge: $minAge
      maxAge: $maxAge
      soldOut: $soldOut
      timedEntry: $timedEntry
      timesRanges: $timesRanges
      performances: $performances
      additionalPerformances: $additionalPerformances
      specialPerformances: $specialPerformances
      performancesClosures: $performancesClosures
      soldOutPerformances: $soldOutPerformances
      openingTimes: $openingTimes
      additionalOpeningTimes: $additionalOpeningTimes
      specialOpeningTimes: $specialOpeningTimes
      openingTimesClosures: $openingTimesClosures
      audienceTags: $audienceTags
      mediumTags: $mediumTags
      styleTags: $styleTags
      geoTags: $geoTags
      talents: $talents
      reviews: $reviews
    }) {
      node {
        id
        name
        summary
        venue {
          id
        }
        eventSeries {
          id
        }
        talents {
          talent {
            id
          }
        }
      }
    }
  }
`;

export const UPDATE_EVENT_MUTATION = `
  mutation UpdateEvent(
    $id: ID!
    $status: StatusTypeEnum!
    $version: Int!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $eventType: EventTypeEnum!
    $occurrenceType: OccurrenceTypeEnum!
    $costType: CostTypeEnum!
    $summary: String!
    $rating: Int!
    $bookingType: BookingTypeEnum!
    $venueId: ID!
    $eventSeriesId: ID
    $useVenueOpeningTimes: Boolean!
    $dateFrom: IsoShortDate
    $dateTo: IsoShortDate
    $costFrom: Float
    $costTo: Float
    $bookingOpens: IsoShortDate
    $venueGuidance: String
    $duration: ShortTime
    $minAge: Int
    $maxAge: Int
    $soldOut: Boolean
    $timedEntry: Boolean
    $timesRanges: [TimesRangeInput!]
    $performances: [DayPerformanceInput!]
    $additionalPerformances: [DatePerformanceInput!]
    $specialPerformances: [SpecialPerformanceInput!]
    $performancesClosures: [DateClosedTimeAtInput!]
    $soldOutPerformances: [DatePerformanceInput!]
    $openingTimes: [DayOpeningTimeInput!]
    $additionalOpeningTimes: [DateOpeningTimeInput!]
    $specialOpeningTimes: [SpecialOpeningTimeInput!]
    $openingTimesClosures: [DateClosedTimeRangeInput!]
    $audienceTags: [TagInput!]
    $mediumTags: [TagInput!]
    $styleTags: [TagInput!]
    $geoTags: [TagInput!]
    $talents: [EventTalentInput!]
    $reviews: [ReviewInput!]
  ) {
    updateEvent(input: {
      id: $id
      status: $status
      version: $version
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      eventType: $eventType
      occurrenceType: $occurrenceType
      costType: $costType
      summary: $summary
      rating: $rating
      bookingType: $bookingType
      venueId: $venueId
      eventSeriesId: $eventSeriesId
      useVenueOpeningTimes: $useVenueOpeningTimes
      dateFrom: $dateFrom
      dateTo: $dateTo
      costFrom: $costFrom
      costTo: $costTo
      bookingOpens: $bookingOpens
      venueGuidance: $venueGuidance
      duration: $duration
      minAge: $minAge
      maxAge: $maxAge
      soldOut: $soldOut
      timedEntry: $timedEntry
      timesRanges: $timesRanges
      performances: $performances
      additionalPerformances: $additionalPerformances
      specialPerformances: $specialPerformances
      performancesClosures: $performancesClosures
      soldOutPerformances: $soldOutPerformances
      openingTimes: $openingTimes
      additionalOpeningTimes: $additionalOpeningTimes
      specialOpeningTimes: $specialOpeningTimes
      openingTimesClosures: $openingTimesClosures
      audienceTags: $audienceTags
      mediumTags: $mediumTags
      styleTags: $styleTags
      geoTags: $geoTags
      talents: $talents
      reviews: $reviews
    }) {
      node {
        id
        name
        summary
        venue {
          id
        }
        eventSeries {
          id
        }
        talents {
          talent {
            id
          }
        }
      }
    }
  }
`;

export const TALENT_QUERY = `
  query GetTalent($id: ID!) {
    talent(id: $id) {
      id
      firstNames
      lastName
      commonRole
    }
  }
`;

export const TALENT_FOR_EDIT_QUERY = `
  query GetTalentForEdit($id: ID!) {
    talentForEdit(id: $id) {
      id
      firstNames
      lastName
      commonRole
      version
    }
  }
`;

export const CREATE_TALENT_MUTATION = `
  mutation CreateTalent(
    $status: StatusTypeEnum!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $firstNames: String
    $lastName: String!
    $talentType: TalentTypeEnum!
    $commonRole: String!
  ) {
    createTalent(input: {
      status: $status
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      firstNames: $firstNames
      lastName: $lastName
      talentType: $talentType
      commonRole: $commonRole
    }) {
      node {
        id
        firstNames
        lastName
        commonRole
      }
    }
  }
`;

export const UPDATE_TALENT_MUTATION = `
  mutation UpdateTalent(
    $id: ID!
    $status: StatusTypeEnum!
    $version: Int!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $firstNames: String
    $lastName: String!
    $talentType: TalentTypeEnum!
    $commonRole: String!
  ) {
    updateTalent(input: {
      id: $id
      status: $status
      version: $version
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      firstNames: $firstNames
      lastName: $lastName
      talentType: $talentType
      commonRole: $commonRole
    }) {
      node {
        id
        firstNames
        lastName
        commonRole
      }
    }
  }
`;

export const VENUE_QUERY = `
  query GetVenue($id: ID!) {
    venue(id: $id) {
      id
      name
      venueType
      postcode
    }
  }
`;

export const VENUE_FOR_EDIT_QUERY = `
  query GetVenueForEdit($id: ID!) {
    venueForEdit(id: $id) {
      id
      name
      venueType
      postcode
      version
    }
  }
`;

export const CREATE_VENUE_MUTATION = `
  mutation CreateVenue(
    $status: StatusTypeEnum!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $venueType: VenueTypeEnum!
    $address: String!
    $postcode: String!
    $latitude: Float!
    $longitude: Float!
    $email: String
    $telephone: String
    $wheelchairAccessType: WheelchairAccessTypeEnum!
    $disabledBathroomType: DisabledBathroomTypeEnum!
    $hearingFacilitiesType: HearingFacilitiesTypeEnum!
    $hasPermanentCollection: Boolean!
    $openingTimes: [DayOpeningTimeInput!]
    $additionalOpeningTimes: [DateOpeningTimeInput!]
    $openingTimesClosures: [DateClosedTimeRangeInput!]
    $namedClosures: [NamedClosureTypeEnum!]
  ) {
    createVenue(input: {
      status: $status
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      venueType: $venueType
      address: $address
      postcode: $postcode
      latitude: $latitude
      longitude: $longitude
      email: $email
      telephone: $telephone
      wheelchairAccessType: $wheelchairAccessType
      disabledBathroomType: $disabledBathroomType
      hearingFacilitiesType: $hearingFacilitiesType
      hasPermanentCollection: $hasPermanentCollection
      openingTimes: $openingTimes
      additionalOpeningTimes: $additionalOpeningTimes
      openingTimesClosures: $openingTimesClosures
      namedClosures: $namedClosures
    }) {
      node {
        id
        name
        venueType
        postcode
      }
    }
  }
`;

export const UPDATE_VENUE_MUTATION = `
  mutation UpdateVenue(
    $id: ID!
    $status: StatusTypeEnum!
    $version: Int!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $venueType: VenueTypeEnum!
    $address: String!
    $postcode: String!
    $latitude: Float!
    $longitude: Float!
    $email: String
    $telephone: String
    $wheelchairAccessType: WheelchairAccessTypeEnum!
    $disabledBathroomType: DisabledBathroomTypeEnum!
    $hearingFacilitiesType: HearingFacilitiesTypeEnum!
    $hasPermanentCollection: Boolean!
    $openingTimes: [DayOpeningTimeInput!]
    $additionalOpeningTimes: [DateOpeningTimeInput!]
    $openingTimesClosures: [DateClosedTimeRangeInput!]
    $namedClosures: [NamedClosureTypeEnum!]
  ) {
    updateVenue(input: {
      id: $id
      status: $status
      version: $version
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      venueType: $venueType
      address: $address
      postcode: $postcode
      latitude: $latitude
      longitude: $longitude
      email: $email
      telephone: $telephone
      wheelchairAccessType: $wheelchairAccessType
      disabledBathroomType: $disabledBathroomType
      hearingFacilitiesType: $hearingFacilitiesType
      hasPermanentCollection: $hasPermanentCollection
      openingTimes: $openingTimes
      additionalOpeningTimes: $additionalOpeningTimes
      openingTimesClosures: $openingTimesClosures
      namedClosures: $namedClosures
    }) {
      node {
        id
        name
        venueType
        postcode
      }
    }
  }
`;

export const REFRESH_SEARCH_INDEX_MUTATION = `
mutation RefreshSearchIndex($entityType: EntityTypeEnum!) {
  refreshSearchIndex(input: { entityType: $entityType }) {
    ok
  }
}
`;
