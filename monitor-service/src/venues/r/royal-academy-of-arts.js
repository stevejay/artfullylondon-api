'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.royalacademy.org.uk';

const EVENT_TYPES_TO_IGNORE = [
  'Friends events',
  'Courses and Classes',
  'Teacher events',
  'Academicians\u0027 Room events',
  'Patrons events',
  'Workshops',
];

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + '/exhibitions-and-events');

  const currentExhibitionLinks = $('#featured-exhibition')
    .add('#exhibitions')
    .find('a:has(.exhibition-dates):has(h1)');

  const currentEventLinks = $('section[data-class="event-item"] > a')
    .map(function() {
      const eventType = $(this).find('.event-type').text();
      return EVENT_TYPES_TO_IGNORE.indexOf(eventType) > -1 ? null : this;
    })
    .map(function() {
      const eventSubtitle = $(this).find('.event-subtitle').text();
      return ['InMind', 'InStudio'].indexOf(eventSubtitle) > -1 ? null : this;
    });

  const result = [];

  currentExhibitionLinks.each(function() {
    result.push(BASE_URL + $(this).attr('href'));
  });

  currentEventLinks.each(function() {
    result.push(BASE_URL + $(this).attr('href'));
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const isEvent = $('section.event-info').length === 1;

  const topInfo = $(isEvent ? 'section.event-info' : 'section.primary-info');
  const title = topInfo.find(isEvent ? 'h2' : 'h2.title').html();

  const data = [
    $(
      isEvent
        ? '#event-information p.standfirst'
        : '#exhibition-standfirst p.standfirst'
    ).html(),
  ];

  data.push($('section.primary-information').html());

  // other info
  const infoAside = $('section.info-aside');

  data.push(
    infoAside.find('.date').html() ||
      infoAside.find('.dates').html() ||
      infoAside.find('.many-dates').html() ||
      undefined
  );

  data.push(infoAside.find('.hours').html() || undefined);
  data.push(infoAside.find('.location').html() || undefined);
  data.push(infoAside.find('.pricing').html() || undefined);

  if ($('section.info-aside').hasClass('sold-out')) {
    data.push('Has sold out.');
  }

  if ($('section.info-aside').hasClass('cancelled')) {
    data.push('Has been cancelled.');
  }

  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + '/plan-your-visit');
  return $('.main.container:has(h2:contains("Plan your visit"))').html();
};
