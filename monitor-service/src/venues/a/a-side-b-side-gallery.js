"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

exports.pageParser = async function() {
  const $ = await pageLoader("http://www.asidebsidegallery.com/gallery.html");

  const data = $("#body_layer p:not(:has(a))").each(function() {
    return $(this).html();
  });

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader("http://www.asidebsidegallery.com/contact.html");
  return $("#footer_layer").html();
};
