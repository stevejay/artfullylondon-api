import moment from "moment-timezone";

export const TALENT_ACTIVE_CARRIE_CRACKNELL = {
  status: "Active",
  commonRole: "Director",
  entityType: "talent",
  firstNames: "Carrie",
  id: "carrie-cracknell",
  lastName: "Cracknell",
  lastName_sort: "cracknell"
};

export const TALENT_ACTIVE_DAVE_DONNELLY = {
  status: "Active",
  id: "dave-donnelly",
  commonRole: "Actor",
  entityType: "talent",
  firstNames: "Dave",
  lastName: "Donnelly",
  lastName_sort: "donnelly"
};

export const VENUE_ACTIVE_ALMEIDA_THEATRE = {
  status: "Active",
  id: "almeida-theatre",
  entityType: "venue",
  name: "Almeida Theatre"
};

export const VENUE_DELETED_ARCOLA_THEATRE = {
  status: "Deleted",
  id: "arcola-theatre",
  entityType: "venue",
  name: "Arcola Theatre",
  latitude: 1,
  longitude: 2,
  locationOptimized: {
    lat: 1,
    lon: 2
  }
};

export const EVENT_SERIES_ACTIVE_BANG_SAID_THE_GUN = {
  status: "Active",
  id: "bang-said-the-gun",
  entityType: "event-series",
  name: "Bang Said the Gun"
};

export const EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION = {
  status: "Active",
  id: "andy-warhol-exhibition",
  entityType: "event",
  name: "Andy Warhol: New York Start",
  venueId: VENUE_ACTIVE_ALMEIDA_THEATRE.id,
  dateFrom: moment()
    .add(-2, "days")
    .format("YYYY/MM/DD"),
  dateTo: moment()
    .add(300, "days")
    .format("YYYY/MM/DD"),
  dates: [
    {
      date: moment()
        .add(10, "days")
        .format("YYYY/MM/DD"),
      from: "10:00",
      to: "18:00"
    }
  ]
};

export const EVENT_ACTIVE_BRITISH_MUSEUM_PERM_COLL = {
  status: "Active",
  id: "british-museum-perm",
  entityType: "event",
  occurrenceType: "Continuous",
  name: "British Museum Permanent Collection"
};
