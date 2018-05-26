"use strict";

const withErrorHandling = require("lambda-error-handler");
const emailService = require("../services/email-service");

async function handler() {
  await emailService.sendMonitorStatusEmail();
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
