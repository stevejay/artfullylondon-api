"use strict";

const elasticsearch = require("elasticsearch");
const yaml = require("js-yaml");
const fs = require("fs");
const uuidv4 = require("uuid/v4");

const dynamodb = require("dynamodb-doc-client-wrapper")({
  connection: {
    region: "localhost",
    endpoint: "http://localhost:8000"
  }
});

exports.EDITOR_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29nbml0bzp1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ._ANmL9jse6JQCwQJumzBEH6omY7OjFFSFYJdS5wdeZE";

exports.READONLY_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29nbml0bzp1c2VybmFtZSI6InJlYWRvbmx5IiwiaWF0IjoxNTE2MjM5MDIyfQ.muh1Jbhv-kBuwZ3pNeDNh8_53iGvs25EwPCAvcvgaWQ";

exports.API_KEY = "dddddddddddddddddddddddddddddddd";

exports.sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

const envVars = yaml.safeLoad(fs.readFileSync("./env.yml", "utf8")).development;

const esClient = new elasticsearch.Client({
  host: envVars.ELASTICSEARCH_HOST,
  log: "error"
});

exports.deleteElasticsearchIndex = async function(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }
};

exports.createElasticsearchIndex = async function(index) {
  const mappingJson = require(`../../../elasticsearch/${index}.json`);
  await exports.deleteElasticsearchIndex(index);
  await esClient.indices.create({ index, body: mappingJson });
};

exports.indexDocument = async function(index, doc) {
  await esClient.create({
    index,
    type: "doc",
    id: doc.id,
    body: doc,
    refresh: "true"
  });
};

exports.getDocument = async function(index, id) {
  return await esClient.get({
    index,
    type: "doc",
    id
  });
};

exports.truncateTable = async function(tableName) {
  const items = await dynamodb.scan({
    TableName: tableName,
    ProjectionExpression: "id"
  });

  for (let i = 0; i < items.length; ++i) {
    await dynamodb.delete({
      TableName: tableName,
      Key: items[i]
    });
  }
};

exports.truncateAllTables = async function() {
  await exports.truncateTable("artfullylondon-development-event");
  await exports.truncateTable("artfullylondon-development-eventseries");
  await exports.truncateTable("artfullylondon-development-talent");
  await exports.truncateTable("artfullylondon-development-venue");
};

exports.createNewVenueBody = function() {
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
};

exports.createNewEventSeriesBody = function() {
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
};

exports.createNewTalentBody = function() {
  return {
    lastName: uuidv4(),
    version: 1,
    status: "Active",
    commonRole: "Poet",
    links: [{ type: "Homepage", url: "http://www.byronvincent.com/" }],
    talentType: "Individual",
    firstNames: "Byron"
  };
};

exports.createNewEventBody = function(venueId, talentId, eventSeriesId) {
  return {
    name: uuidv4(),
    version: 1,
    status: "Active",
    eventType: "Exhibition",
    occurrenceType: "Bounded",
    costType: "Free",
    summary:
      "An exhibition of paintings and the rarely seen drawings of the pioneering and visionary architect Zaha Hadid",
    dateFrom: "2017/01/13",
    dateTo: "2017/02/12",
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
};
