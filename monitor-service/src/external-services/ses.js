const AWS = require('aws-sdk');

const ses = new AWS.SES({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.SERVERLESS_REGION,
});

module.exports = {
  sendEmail: params => ses.sendEmail(params).promise(),
};
