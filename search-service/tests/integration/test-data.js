import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import statusType from "../../src/types/status-type";
import entityType from "../../src/types/entity-type";
import talentType from "../../src/types/talent-type";
import occurrenceType from "../../src/types/occurrence-type";

// TODO are these used anymore?

export const TALENT_ACTIVE_CARRIE_CRACKNELL = {
  status: statusType.ACTIVE,
  commonRole: "Director",
  entityType: entityType.TALENT,
  talentType: talentType.INDIVIDUAL,
  firstNames: "Carrie",
  id: "talent/carrie-cracknell",
  lastName: "Cracknell",
  lastName_sort: "cracknell"
};

export const TALENT_ACTIVE_DAVE_DONNELLY = {
  status: statusType.ACTIVE,
  id: "talent/dave-donnelly",
  commonRole: "Actor",
  entityType: entityType.TALENT,
  talentType: talentType.INDIVIDUAL,
  firstNames: "Dave",
  lastName: "Donnelly",
  lastName_sort: "donnelly"
};

export const VENUE_ACTIVE_ALMEIDA_THEATRE = {
  status: statusType.ACTIVE,
  id: "venue/almeida-theatre",
  entityType: entityType.VENUE,
  name: "Almeida Theatre"
};

export const VENUE_DELETED_ARCOLA_THEATRE = {
  status: statusType.DELETED,
  id: "venue/arcola-theatre",
  entityType: entityType.VENUE,
  name: "Arcola Theatre",
  latitude: 1,
  longitude: 2,
  locationOptimized: {
    lat: 1,
    lon: 2
  }
};

export const EVENT_SERIES_ACTIVE_BANG_SAID_THE_GUN = {
  status: statusType.ACTIVE,
  id: "event-series/bang-said-the-gun",
  entityType: entityType.EVENT_SERIES,
  name: "Bang Said the Gun"
};

export const EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION = {
  status: statusType.ACTIVE,
  id: "event/andy-warhol-exhibition",
  entityType: entityType.EVENT,
  name: "Andy Warhol: New York Start",
  venueId: VENUE_ACTIVE_ALMEIDA_THEATRE.id,
  dateFrom: format(subDays(new Date(Date.now()), 2), "yyyy-MM-dd"),
  dateTo: format(addDays(new Date(Date.now()), 300), "yyyy-MM-dd"),
  dates: [
    {
      date: format(addDays(new Date(Date.now()), 10), "yyyy-MM-dd"),
      from: "10:00",
      to: "18:00"
    }
  ]
};

export const EVENT_ACTIVE_BRITISH_MUSEUM_PERM_COLL = {
  status: statusType.ACTIVE,
  id: "event/british-museum-perm",
  entityType: entityType.EVENT,
  occurrenceType: occurrenceType.CONTINUOUS,
  name: "British Museum Permanent Collection"
};
