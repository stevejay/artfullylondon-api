'use strict';

const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

AWS.events.on('retry', function(response) {
  if (response.error) {
    cloudwatch.putMetricData({
      Namespace: 'AWSRetry',
      MetricData: [
        {
          MetricName: 'Retry',
          Dimensions: [
            {
              Name: 'Message',
              Value: response.error.message,
            },
          ],
          Unit: 'Count',
          Value: 1,
        },
      ],
    });
  }
});
