import * as log from "loglevel";

export default function(handler) {
  return function(event, context, cb) {
    Promise.all(
      (event.Records || []).map(async record => {
        const message = JSON.parse(record.Sns.Message);
        log.error("GOT MESSAGE", JSON.stringify(message));
        return await handler(message);
      })
    )
      .then(result => {
        cb(null, result);
      })
      .catch(err => {
        log.error(`Error in SNS handler: ${err.message}`);
        cb(err);
      });
  };
}
